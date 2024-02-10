import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';

function UrlShortener() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [error, setError] = useState('');
    const [showTooltip, setShowTooltip] = useState(false); 

    const handleShortenUrl = () => {
        const apiUrl = 'https://wewink.ir/api/links';

        
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

        
        if (!urlRegex.test(originalUrl)) {
            setError('Invalid URL format');
            return; 
        }

        axios.post(apiUrl, { url: originalUrl })
            .then(response => {
                const { data } = response;
                setShortenedUrl(`https://${data.short_url}`);
                setError('');
            })
            .catch(error => {
                console.error(error);
                setShortenedUrl('');
                setError('Error from API');
            });
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl)
            .then(() => {
                console.log('Short URL copied to clipboard');
                setShowTooltip(true); 
                setTimeout(() => setShowTooltip(false), 500); 
            })
            .catch(error => {
                console.error('Error copying to clipboard:', error);
            });
    };

    return (
        <div className='container'>
            <h1 className='header'>Create Short <br/>URL!</h1>
            <div className='card'>
                <div className='form'>
                    <input 
                        className='input-field'
                        type="text" 
                        placeholder="https://www.example.com/" 
                        value={originalUrl} 
                        onChange={(e) => setOriginalUrl(e.target.value)} 
                    />
                    <button 
                        className='button'
                        onClick={handleShortenUrl}>Shorten
                    </button>
                </div>
                {shortenedUrl && !error && (
                    <div className='shortened-url'>
                        <p>Shortened URL:</p>
                        <a className='link' href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
                        <button className='copy-button' onClick={handleCopyToClipboard}></button>
                        {showTooltip && (
                            <span className='tooltip' style={{ left: 'calc(50% - 20px)', top: 'calc(100% + 10px)' }}>Copied!</span>
                        )}
                    </div>
                )}
                {error && 
                    <div className='shortened-url err'>
                        <p className='error-message'>{error}</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default UrlShortener;
