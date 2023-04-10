import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Header from '../../components/Header/Header';
import "./RepositoryCardPage.scss"
import star from "../../assets/icons/star.svg"

const RepositoryCardPage = () => {
    const {id} = useParams()
    const [repoData,
        setRepoData] = useState({
        name: "",
        owner: {
            login: "",
            avatar_url: "",
            html_url: "https://www.github.com"
        },
        description: "",
        updated_at: "",
        contributors: [],
        languages:[],
        html_url: "https://www.github.com"
    });

    const getRepositoryInfo = async() => {
        const resp = await fetch("https://api.github.com/repositories/" + id)
        let data = await resp.json()
        const languagesResp = await fetch(data.languages_url)
        const contributorsResp = await fetch(data.contributors_url)
        if(contributorsResp.status === 200 && languagesResp.status === 200){
            const languages = await languagesResp.json()
            const contributors = await contributorsResp.json()
            data = {...data, contributors: contributors, languages: Object.keys(languages)}
            console.log(contributors);
        }
        console.log("AT LAST:" ,data);
        return data
    }

    useEffect(() => {
        getRepositoryInfo().then(res => setRepoData(res))
    }, []);

    const convertDate = (date) => {
        const YMD = date.slice(0,9)
        const HMS = date.slice(11, 19)
        return `${YMD} в ${HMS}`
    }

    return (
        <section>
            <Header/>
            <div className='repository-info'>
                <div className="container">
                    <Link to={"/"}>
                        <div className="to-main">Назад</div>
                    </Link>
                    <div className="repository__credentials">
                        <a href={repoData.html_url} target="_blank" className='credentials__name'>{repoData.name}</a>
                        <a href={repoData.owner.html_url} target="_blank" className='credentials__author'>{repoData.owner.login}</a>
                    </div>

                    <div className="repository__full-card">
                        <div className="repository__top-info">
                            <div className="repository__owner">
                                <div className="owner__img">
                                    <img src={repoData.owner.avatar_url} alt="Owner avatar"/>
                                </div>
                                <div className="owner__credentials">
                                    <p className="owner__repo">Репозиторий <span className="text-strong">{repoData.name}</span>
                                    </p>
                                    <p className="owner__login">Владелец <span className="text-strong">{repoData.owner.login}</span>
                                    </p>
                                    <p className="owner__login">Последнее обновление <span className="text-strong">{convertDate(repoData.updated_at)}</span>
                                    </p>
                                </div>

                                

                            </div>
                            <div className="repository__star-count">
                                    <img src={star} alt="" />
                                    <p className="stars">{repoData.stargazers_count}</p>
                                </div>
                        </div>

                        <div className="repository__center-info">
                            <p className='repository__description'>"{repoData.description}"</p>
                        </div>
                        <div className="repository__contributor-list">
                            <h1 className='contributors'>Контрибьюторы:</h1>
                                { repoData.contributors && repoData.contributors.length > 0 ? repoData.contributors.slice(0,10).map(contributor=><p className='contributor'>{contributor.login} ({contributor.contributions})</p>) : "Нет"}
                        </div>
                        <div className="repository__languages-list"> 
                            <h1 className='languages'>Языки:</h1>
                                { repoData.languages && repoData.languages !== null ? repoData.languages.map(language=><p className='language'>{language}</p>) : "Нет"}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RepositoryCardPage;