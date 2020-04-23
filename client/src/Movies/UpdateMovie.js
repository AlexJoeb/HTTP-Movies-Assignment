import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

export default function UpdateMovie({ getMovieList }) {

    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [metaScore, setMetaScore] = useState(0);
    const [stars, setStars] = useState([]);
    const [starName, setStarName] = useState('');

    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/movies/${id}`)
            .then(({ data }) => {
                setTitle(data.title);
                setDirector(data.director);
                setMetaScore(data.metascore);
                setStars(data.stars);
            }).catch(error => {
                console.error(error.message);
            })
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        if (!title.trim() || !director.trim() || isNaN(parseInt(metaScore)) || stars.length <= 0) return;

        axios.put(`http://localhost:5000/api/movies/${id}`, {
            id,
            title,
            director,
            metascore: metaScore,
            stars,
        })
            .then(resp => {
                getMovieList();
            history.push("/");
        })
        .catch(error => console.error(error.message));

    }

    const handleAddStar = e => {
        e.preventDefault();
        if (!starName.trim()) return;
        else setStars([...stars, starName]);
        setStarName('');
    }

    const removeStar = index => {
        setStars(stars.filter((star, i) => i !== index));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Title' value={title} onChange={({ target }) => setTitle(target.value)} />
                <input type='text' placeholder='Director' value={director} onChange={({ target }) => setDirector(target.value)} />
                <input type='text' placeholder='Meta Score' value={metaScore} onChange={({ target }) => /^([0-9\b]+)?$/.test(target.value) ? setMetaScore(target.value) : null} />
                <button type='submit'>Update Movie</button>
                <br />
                <br />
                <input type='text' placeholder='Add Star' value={starName} onChange={({ target }) => setStarName(target.value)} />
                <button onClick={handleAddStar}>Add Star</button>
                <ul>
                    {
                        stars && stars.map((star, index) => <li key={index} onClick={() => removeStar(index)}>{star}</li>)
                    }
                </ul>
            </form>

        </div>
    )
}