/* eslint-disable react/prop-types */
import { useRef } from 'react';
import './Draggable.css';
import { forwardRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

const Draggable = forwardRef(({ children, draggable }, ref) => {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [centeredElement, setCenteredElement] = useState(null);

    useEffect(() => {
        if (!draggable) {
            ref.current.classList.add('closed');
        } else {
            ref.current.classList.remove('closed');
            snapToFirstElement();
        }
        ref.current.addEventListener('touchmove', onMouseMove, { passive: false });
        return () => {
            window.removeEventListener('touchmove', onMouseMove);
        };
    }, [draggable]);

    const onMouseDown = (e) => {
        if (!draggable) return;
        if (e.pageX) {
            e.preventDefault();
        } else if (!centeredElement) {
            snapToClosestElement();
        }
        isDragging.current = true;
        startX.current = (e.pageX || e.touches[0].pageX) - ref.current.offsetLeft;
        scrollLeft.current = ref.current.scrollLeft;
    };

    const onMouseUp = () => {
        if (!draggable) return;
        isDragging.current = false;
        snapToClosestElement();
    };

    const onMouseMove = (e) => {
        if (!draggable) return;
        if (!isDragging.current) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - ref.current.offsetLeft;
        let walk = (x - startX.current);

        ref.current.scrollLeft = scrollLeft.current - walk;
    };

    const snapToClosestElement = () => {
        const container = ref.current;
        const childrenArray = Array.from(container.children);
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;

        let closestChild = null;
        let closestOffset = Infinity;

        childrenArray.forEach((child) => {
            const childCenter = child.offsetLeft + child.offsetWidth / 2;
            const offset = Math.abs(containerCenter - childCenter);
            if (offset < closestOffset && child !== centeredElement) {
                closestOffset = offset;
                closestChild = child;
            }
        });

        if (closestChild) {
            const childCenter = closestChild.offsetLeft + closestChild.offsetWidth / 2;
            const targetScrollLeft = container.scrollLeft + (childCenter - containerCenter);

            smoothScroll(container.scrollLeft, targetScrollLeft, 400);
            setCenteredElement(closestChild);
        }
    };

    const snapToFirstElement = () => {
        const container = ref.current;
        const firstChild = container.children[0];
        const targetScrollLeft = firstChild.offsetLeft;

        smoothScroll(container.scrollLeft, targetScrollLeft, 400);
        setCenteredElement(firstChild);
    };

    const smoothScroll = (start, end, duration) => {
        const startTime = performance.now();

        const scrollAnimation = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1); // Ensure the progress is capped at 1
            const ease = easeOutCubic(progress);

            ref.current.scrollLeft = start + (end - start) * ease;

            if (progress < 1) {
                requestAnimationFrame(scrollAnimation);
            }
        };

        requestAnimationFrame(scrollAnimation);
    };

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    return (
        <div ref={ref}
            className="draggable-container"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onMouseDown}
            onTouchEnd={onMouseUp}
        >
            {children}
        </div>
    );
});

Draggable.displayName = 'Draggable';

export default Draggable;