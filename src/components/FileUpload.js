import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setTranscription('');
        setDownloadLink('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setTranscription(response.data.transcription);
            const textBlob = new Blob([response.data.transcription], { type: 'text/plain' });
            setDownloadLink(URL.createObjectURL(textBlob));
        } catch (error) {
            console.error('Error uploading file:', error);
            setTranscription('Error: Unable to transcribe the audio.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Speech to Text Converter</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="audio/*, video/*" onChange={handleFileChange} required />
                <button type="submit" disabled={loading}>Upload</button>
            </form>
            {loading && <p>Loading... Please wait.</p>}
            {transcription && (
                <div>
                    <h2>Transcribed Text:</h2>
                    <p>{transcription}</p>
                    {downloadLink && (
                        <a href={downloadLink} download="transcription.txt">
                            Download Text File
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
