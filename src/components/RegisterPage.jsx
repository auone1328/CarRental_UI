import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {Context} from "../main.jsx"
import {observer} from "mobx-react"
import { Link } from 'react-router'

const RegisterPage = observer(() => {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState(''); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronymic, setPatronymic] = useState('');   
    const {auth} = useContext(Context);
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Регистрация
                </h2>
                </div>
                {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
                )}
                {/* <form className="mt-8 space-y-6" onSubmit={handleSubmit}> */}
                <form className="mt-8 space-y-6">
                    {/* <input type="hidden" name="remember" defaultValue="true" /> */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="firstName" className="sr-only">
                                Имя
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Имя"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="sr-only">
                                Фамилия
                            </label>
                            <input  
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Фамилия"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="patronymic" className="sr-only">
                                Отчество
                            </label>
                            <input  
                                id="patronymic"
                                name="patronymic"
                                type="text"
                                autoComplete="additional-name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Отчество"
                                value={patronymic}
                                onChange={(e) => setPatronymic(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email адрес
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email адрес"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Пароль
                            </label>
                            <input  
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="passwordRepeat" className="sr-only">
                                Повтор пароля
                            </label>
                            <input
                                id="passwordRepeat"
                                name="passwordRepeat"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Повторите пароль"
                                value={repeatedPassword}
                                onChange={(e) => setRepeatedPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                        onClick={async () => {
                            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
                            if (!emailRegex.test(email)) {
                                setError('Введите корректный email'); 
                            }
                            else if (!email.trim() || !password.trim()) {
                                setError('Заполните все поля!')
                            } 
                            else {                             
                                if (password == repeatedPassword) {
                                    await auth.register(firstName, lastName, patronymic, email, password)

                                    if (auth.isRegisterSucceed) {     
                                        setError('')                             
                                        navigate("/login")                                   
                                        auth.setRegisterSucceed(false)
                                    }
                                    else {
                                        setError('Учётная запись для данной электронной почты уже существует!')
                                    }                                         
                                }                         
                                else {
                                    setError('Пароль и повтор пароля не совпадают!')
                                }                             
                            }                       
                        }}
                        type="button"
                        disabled={auth.isLoading}
                        className={`group relative w-full flex justify-center rounded-md py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${auth.isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                        {auth.isLoading ? (
                            <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Зарегистрироваться...
                            </>
                        ) : 'Зарегистрироваться...'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>        
    )
})

export default RegisterPage;