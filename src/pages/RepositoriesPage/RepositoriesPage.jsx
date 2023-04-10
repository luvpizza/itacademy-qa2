import React, {useEffect, useState} from 'react';
import Header from '../../components/Header/Header';
import useDebounce from '../../components/Hooks/useDebounce';
import Repository from '../../components/Repository/Repository';
import TextInput from '../../components/UI/TextInput/TextInput';
import "./RepositoriesPage.scss"
const RepositoriesPage = () => {

    const [isSearched,
        setIsSearched] = useState(JSON.parse(localStorage.getItem("GitIsSearched")) || false)
    const [searchQuery,
        setSearchQuery] = useState(localStorage.getItem("GitSearchQ") || "")
    const [currentRepos,
        setCurrentRepos] = useState([])
    const [totalPages,
        setTotalPages] = useState([])
    const [currentPage,
        setCurrentPage] = useState(localStorage.getItem("GitDefaultPage") || 1);
    const debouncedQuery = useDebounce(searchQuery, 500)

    const getAllRepos = async() => {
        const resp = await fetch(`https://api.github.com/search/repositories?q=stars:%3E1&sort=stars&order=desc&per_page=10&page=${currentPage}`, {})
        const data = await resp.json()
        setTotalPages(countPages(data.total_count))
        return data
    }

    const searchRepos = async(q) => {
        const resp = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=10&page=${currentPage}`, {})
        const data = await resp.json()
        setTotalPages(countPages(data.total_count))
        return data
    }

    const countPages = (total) => {
        let pagesCount = 1
        const pages = []
        total > 100
            ? pagesCount = 10
            : pagesCount = Math.ceil(total / 10)

        for (let i = 1; i <= pagesCount; i++) {
            pages.push(i)
        }
        return pages
    }
    useEffect(() => {
        if (debouncedQuery) {
            setCurrentPage(1)
            setIsSearched(true)
            localStorage.setItem("GitSearchQ", searchQuery);
            localStorage.setItem("GitIsSearched", true);
            setCurrentRepos([])
            searchRepos(debouncedQuery).then(res => setCurrentRepos(res.items))
        } else {
            setCurrentRepos([])
            setIsSearched(false)
            getAllRepos().then(res => setCurrentRepos(res.items))
            localStorage.setItem("GitSearchQ", searchQuery);
            localStorage.setItem("GitIsSearched", false)
        }
    }, [debouncedQuery]);

    useEffect(() => {
        if (isSearched === false) {
            getAllRepos().then(res => setCurrentRepos(res.items))
        } else {
            searchRepos(searchQuery).then(res => setCurrentRepos(res.items))
        }
        localStorage.setItem("GitDefaultPage", currentPage)
    }, [currentPage]);

    return (
        <div>
            <Header/>

            <div className="container">
                <TextInput
                    value={searchQuery}
                    className="search-bar"
                    placeholder={"Введите имя репозитория..."}
                    onChange={(e) => {
                    setSearchQuery(e.target.value)
                }}/>

                <h1>{debouncedQuery}</h1>
                <div className="repository-box">
                    {(currentRepos && currentRepos.length > 0)
                        ? currentRepos.map((item) => <Repository
                            id={item.id}
                            name={item.name}
                            stars={item.stargazers_count}
                            link={item.html_url}/>)
                        : "не найдено"}
                </div>

                <div className="all-page-selector">

                    {totalPages.map(page => <button

                        className= {(page === currentPage) ? "page-selector__btn page-selector__btn_active" : "page-selector__btn"}
                        onClick={() => {
                        setCurrentPage(page)
                    }}>{page}</button>)}

                </div>

            </div>
        </div>
    );
};

export default RepositoriesPage;