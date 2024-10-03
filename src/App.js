import './App.css';
import Gallery from './components/gallery/Gallery';
import loadingIcon from '../assets/loading.svg';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';

const App = () => {
    const [carrousels, setCarrousels] = useState([]);
    const [loaded, setLoaded] = useState(undefined);

    const getCarrousels = useCallback(async () => {
        try {
            setLoaded(false);
            const response = await fetch('https://lucasbodet.rh-medias.net/wp-json/wp/v2/realisations');
            const data = await response.json();

            const parsedCarrousels = await Promise.all(
                data.map(async (carrousel) => {
                    const subtitle = await getCarrouselSubtitle(carrousel.id);
                    const images = await getCarrouselImages(carrousel.id);

                    return {
                        id: carrousel.id,
                        title: carrousel.title,
                        subtitle: subtitle,
                        images: images
                    };
                })
            );

            setCarrousels(parsedCarrousels);
            setLoaded(true);
        } catch (error) {
            setLoaded(false);
            console.error('Error fetching carrousels:', error);
        }
    }, []);

    const getCarrouselImages = async (id) => {
        try {
            const response = await fetch(`https://lucasbodet.rh-medias.net/wp-json/wp/v2/media?parent=${id}`);
            const data = await response.json();
            return data.map(image => image.guid);
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    };

    const getCarrouselSubtitle = async (id) => {
        try {
            const response = await fetch(`http://localhost/gallery/api/getProjectAddress.php?id=${id}`);
            const data = await response.json();
            return data || null;
        } catch (error) {
            console.error('Error fetching subtitle:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!loaded) {
            getCarrousels();
        }
    }, [getCarrousels, loaded]);

    return (
        loaded ?
            <Gallery carrousels={carrousels}/> :
            <div className="loading-wrapper">
                <img src={loadingIcon} alt="loading" />
            </div>
    );
};

export default App;