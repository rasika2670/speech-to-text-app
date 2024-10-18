import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [fileName, setFileName] = useState("");
    const [isFileSelected, setIsFileSelected] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setIsFileSelected(true);
        }
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
        <div className='flex flex-col items-center p-4'>
            <h1 className='font-extrabold text-4xl m-4'>Lecture Summarizer</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 items-center'>
            <div className="flex items-center justify-center w-full">
                <label
                    className={`flex flex-col items-center px-4 py-2 ${isFileSelected ? "bg-green-500 text-white" : "bg-white text-Blue"
                        } rounded-lg shadow-lg tracking-wide uppercase border ${isFileSelected ? "border-green-500" : "border-Blue"
                        } cursor-pointer hover:bg-Blue hover:text-white transition duration-100`}
                >
                    <span className="text-base leading-normal font-semibold">
                        {fileName || "Choose a file"}
                    </span>
                    <input type="file" className="hidden" onChange={handleFileChange}/>
                </label>
            </div>
                <button className='bg-[#489fb5] font-bold' type="submit" disabled={loading}>Upload</button>
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
