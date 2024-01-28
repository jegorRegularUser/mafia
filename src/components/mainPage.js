import React, { useEffect, useState } from 'react'
import './MainPage.css'

function MainPage() {
	const [gameIsStarted, setGameIsStarted] = useState(false)
	const [gameIsEnd, setGameIsEnd] = useState(false)
	const [numberRound, setNumberRound] = useState(0)
	const [isRoleShowing, setIsRoleShowing] = useState(false)
	const [text, setText] = useState()
	const [nightIsGoing, setNightIsGoing] = useState(false)
	const [nightIsOver, setNightIsOver] = useState(false)
	const [players, setPlayers] = useState([])
	//Добавление новых игроков
	const addHandler = () => {
		setPlayers([
			...players,
			{ id: Date.now(), name: text, role: '', countOfVisits: 0 },
		])
		setText('')
	}
	//Удаление игроков
	const deleteHandler = idPl => {
		setPlayers(players.filter(pl => pl.id !== +idPl.target.id))
	}
	//таймер идущий во время защиты/монолога
	const [timeRemaining, setTimeRemaining] = useState(60)
	useEffect(() => {
		const timer = setTimeout(() => {
			if (timeRemaining > 0) {
				setTimeRemaining(prevTime => prevTime - 1)
			}
		}, 1000)
		return () => clearTimeout(timer)
	}, [timeRemaining])

	const [dayIsGoing, setDayIsGoing] = useState(false)
	const [dayIsOver, setDayIsOver] = useState(false)
	//определение победы
	const [countOfMafia, setCountOfMafia] = useState(2)
	const findCountOfMafia = () => {
		let i = 0
		if (players.find(pl => pl.role === 'Мафия') !== undefined) {
			i++
		}
		if (players.find(pl => pl.role === 'Дон') !== undefined) {
			i++
		}
		i === 2
			? setCountOfMafia(2)
			: i === 1
			? setCountOfMafia(1)
			: setCountOfMafia(0)
		if (i === 0 || players.length / 2 === i) {
			setGameIsEnd(true)
		}
	}
	//возвращение в начало
	const returnOnStart = () => {
		setGameIsEnd(false)
		setGameIsStarted(false)
		setCountOfMafia(2)
		setDayIsGoing(false)
		setDayIsOver(false)
		setDefenceIsGoing(false)
		setDefenceIsOver(false)
		setEjectionIsGoing(false)
		setExposeIsOver(false)
		setExposeOnEjectionIsGoing(false)
		setIsCorrect(2)
		setIsMurder(false)
		setIsRoleShowing(false)
		setIsRoleTaskComplited(false)
		setKilledPlayer({})
		setLastMinuteIsGoing(false)
		setNightIsEnd(false)
		setNightIsGoing(false)
		setNightIsOver(false)
		setNumberOfActivePlayer(1)
		setNumberRound(0)
	}

	//начало игры
	const startGame = () => {
		let r = 1
		//случайная расстановка ролей
		setPlayers(
			players
				.toSorted(() => Math.random() - 0.5)
				.map(player => {
					if (r === 1) {
						player.role = 'Мафия'
					}
					if (r === 2) {
						player.role = 'Дон'
					}
					if (r === 3) {
						player.role = 'Шериф'
					}
					if (r >= 4) {
						player.role = 'Мирный житель'
					}
					r++
					return player
				})
				.toSorted((a, b) => {
					return a.id - b.id
				})
		)
		setGameIsStarted(true)
		setMafia(
			players.map(pl => {
				if (pl.role === 'Мафия' || pl.role === 'Дон') {
					return pl
				}
			})
		)
		startDay()
	}
	const [mafia, setMafia] = useState([])

	//начало дня
	const startDay = () => {
		if (nightIsEnd && isMurder) {
			setPlayers(p =>
				p.toSpliced(
					p.findIndex(e => e.id === killedPlayer.id),
					1
				)
			)
		}
		setPlayers(prev =>
			prev.map(player => {
				player.countOfVisits = 0
				return player
			})
		)
		setDayIsGoing(true)
		setDayIsOver(false)
		setNightIsEnd(false)
		setExposeIsOver(false)
		setDefenceIsOver(false)
		setEjectionIsOver(false)
		setIsRoleShowing(false)
		setIsRoleTaskComplited(false)
		setIsCorrect(2)
		setRole('')
		setNumberOfActivePlayer(1)
		setNumberRound(prev => (prev += 1))
		setTimeRemaining(60)
	}
	const [numberOfActivePlayer, setNumberOfActivePlayer] = useState(1)

	//////////снизу компонент ночи
	const [isRoleTaskComplited, setIsRoleTaskComplited] = useState(false)
	const startNight = () => {
		findCountOfMafia()
		setLastMinuteIsGoing(false)
		setNightIsGoing(true)
		setNumberOfActivePlayer(1)
	}
	//убийство для мафии
	const visit = idPl => {
		setPlayers(
			players.map(pl => {
				if (pl.id === +idPl.target.id) {
					pl.countOfVisits++
					return pl
				} else return pl
			})
		)
		setIsRoleTaskComplited(true)
	}
	//решение задaчки для мирного
	const newRandom = () => {
		return Math.round(Math.random() * 2 + 1)
	}
	const [mran1, setMran1] = useState(newRandom())
	const [mran2, setMran2] = useState(newRandom())
	const mr = mran1 + mran2
	const [isCorrect, setIsCorrect] = useState(2)
	const checkAnswer = answer => {
		;+answer.target.id !== mr ? setIsCorrect(0) : setIsCorrect(1)
	}
	const killedPlayerId =
		countOfMafia === 2
			? players.findIndex(pl => pl.countOfVisits >= 2)
			: players.findIndex(pl => pl.countOfVisits === 1)
	const [killedPlayer, setKilledPlayer] = useState({})

	const nextPlayerAtNightHandler = () => {
		setIsRoleShowing(false)
		setIsRoleTaskComplited(false)
		setNumberOfActivePlayer(prevNum => (prevNum += 1))
		setTimeRemaining(60)
		setIsCorrect(2)
		setRole('')
		if (numberOfActivePlayer + 1 === players.length) {
			setNightIsOver(true)
		}
	}
	const [role, setRole] = useState('')
	const checkRole = idPl => {
		setRole(players[players.findIndex(pl => pl.id === +idPl.target.id)].role)
	}
	const [nightIsEnd, setNightIsEnd] = useState(false)
	const [isMurder, setIsMurder] = useState(false)

	const endNight = () => {
		setIsRoleShowing(false)
		setNightIsEnd(true)
		setNightIsGoing(false)
		setNightIsOver(false)
		if (killedPlayerId !== -1) {
			if (killedPlayerId !== -1) {
				setIsMurder(true)
				setKilledPlayer(players[killedPlayerId])
			}
		}
	}
	//////////////// сверху компонент ночи

	//переключение на следующего игрока
	const nextPlayerHandler = () => {
		findCountOfMafia()
		setKilledPlayer({})
		setIsRoleShowing(false)
		setNumberOfActivePlayer(prevNum => (prevNum += 1))
		setTimeRemaining(60)
		if (numberOfActivePlayer + 1 === players.length) {
			setDayIsOver(true)
		}
	}
	const roleShowingHandler = () => {
		setIsRoleShowing(prev => !prev)
	}

	//массив повторяет массив игроков но здесь нет ролей и добален счет голосов в игрока
	const [playersVoices, setPlayersVoices] = useState([])
	//начало выбора претендентов на голосование
	const [exposeOnEjectionIsGoing, setExposeOnEjectionIsGoing] = useState(false)
	const [exposeIsOver, setExposeIsOver] = useState(false)
	const [ejectionIsOver, setEjectionIsOver] = useState(false)
	const [ejectionIsGoing, setEjectionIsGoing] = useState(false)

	const startExposeOnEjection = () => {
		setPlayersVoices(
			players.map(el => {
				const { role, ...newEl } = el
				return { ...newEl, count: 0, isExpose: false }
			})
		)
		setNumberOfActivePlayer(1)
		setExposeOnEjectionIsGoing(true)
		setIsRoleShowing(false)
		setDayIsGoing(false)
	}

	//переход на следующего игрока
	const nextPlayerOnExposeEjectionHandler = () => {
		setNumberOfActivePlayer(prevNum => (prevNum += 1))
		if (numberOfActivePlayer + 1 === players.length) {
			setExposeIsOver(true)
		}
		if (numberOfActivePlayer === players.length) {
			checkOnVoices()
		}
	}
	//проверяет больше ли выбранных на голосование чем 1 и перекидывает на голос или ночь в зависимости от этого
	const checkOnVoices = () => {
		setExposeOnEjectionIsGoing(false)
		if (playersVoices.filter(el => el.isExpose === true).length > 1) {
			startEjection()
		} else {
			startNight()
		}
	}
	const nextPlayerEjectionHandler = () => {
		setNumberOfActivePlayer(prevNum => (prevNum += 1))
		if (numberOfActivePlayer === players.length) {
			setEjectionIsOver(true)
			setEjectionIsGoing(false)
		}
	}
	//выставление на голосование
	const exposeHandler = idPl => {
		setPlayersVoices(
			playersVoices.map(pl => {
				if (pl.id === +idPl.target.id) {
					pl.isExpose = true
				}
				return pl
			})
		)
		nextPlayerOnExposeEjectionHandler()
	}
	//начало голосования
	const startEjection = () => {
		setDefenceIsGoing(false)
		setNumberOfActivePlayer(1)
		setEjectionIsGoing(true)
		setExposeOnEjectionIsGoing(false)
		setPlayersVoices(prev => prev.filter(pl => pl.isExpose))
	}
	//выбор на голосовании
	const ejectionHandler = idPl => {
		setPlayersVoices(
			playersVoices.map(pl => {
				if (pl.id === +idPl.target.id) {
					pl.count += 1
				}
				return pl
			})
		)
		nextPlayerEjectionHandler()
	}
	const [lastMinuteIsGoing, setLastMinuteIsGoing] = useState(false)
	const [defenceIsGoing, setDefenceIsGoing] = useState(false)
	const [defenceIsOver, setDefenceIsOver] = useState(false)

	//подсчет голосов и соответствующий вызов одного из экранов
	const [intervalIsOpened, setIntervalIsOpened] = useState(false)
	const calculateVoices = () => {
		setEjectionIsOver(false)
		let maxCount = playersVoices.reduce((a, b) => (a.count > b.count ? a : b))
		setPlayersVoices(prev => prev.filter(pl => pl.count === maxCount.count))
		setIntervalIsOpened(true)
	}
	const nextDefencerHandler = () => {
		setNumberOfActivePlayer(prevNum => (prevNum += 1))
		setTimeRemaining(60)
		if (numberOfActivePlayer + 1 === playersVoices.length) {
			setDefenceIsOver(true)
		}
	}
	//вызов экрана прощальной минуты
	const lastMinute = () => {
		setIntervalIsOpened(false)
		setTimeRemaining(60)
		setLastMinuteIsGoing(true)
		setPlayers(p =>
			p.toSpliced(
				p.findIndex(e => e.id === playersVoices[0].id),
				1
			)
		)
	}
	//вызов экрана защиты
	const startDefence = () => {
		setNumberOfActivePlayer(1)
		setIntervalIsOpened(false)
		setTimeRemaining(60)
		setDefenceIsGoing(true)
	}
	//////////////////////////////////////////////////////////
	return (
		<>
			{!gameIsStarted && !gameIsEnd && (
				<div className={`${gameIsStarted ? 'noDisplay' : ''}`}>
					<h1>Добро пожаловать в "Мафия"</h1>
					<h4>Для начала введите всех игроков(минимум 5)</h4>
					<ul>
						{players.map((player, index) => {
							return (
								<li key={index}>
									<span>
										{player.name} - {index + 1} игрок
									</span>
									<button
										className='delete'
										id={player.id}
										onClick={deleteHandler}
									>
										x
									</button>
								</li>
							)
						})}
					</ul>
					<input
						value={text}
						placeholder='Имя'
						onChange={e => setText(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								addHandler()
							}
						}}
					></input>
					<button className={'enter'} onClick={addHandler}>
						Ввести имя
					</button>
					<div>
						<button
							className={`enter ${players.length < 5 ? 'noDisplay' : ''}`}
							onClick={startGame}
						>
							Начать игру
						</button>
					</div>
				</div>
			)}
			{/* здесь по своей сути начинается  компонент дня но мне пока лень разбивать это на компоненты и мучатся с пропсами*/}
			{gameIsStarted && !gameIsEnd && (
				<div>
					{dayIsGoing && (
						<div
							className={`${gameIsStarted && dayIsGoing ? '' : 'noDisplay'}`}
						>
							<h1>{numberRound} раунд</h1>
							<h4>
								Игрок номер {numberOfActivePlayer} -{' '}
								{players[numberOfActivePlayer - 1].name}
							</h4>
							<button
								className={`enter ${isRoleShowing ? 'noDisplay' : ''}`}
								onClick={roleShowingHandler}
							>
								Показать роль
							</button>
							<button
								className={`enter ${isRoleShowing ? '' : 'noDisplay'}`}
								onClick={roleShowingHandler}
							>
								Скрыть роль
							</button>
							<h4 className={`${isRoleShowing ? '' : 'noDisplay'}`}>
								Ваша роль - {players[numberOfActivePlayer - 1].role}
								{countOfMafia === 2 &&
									`${
										players[numberOfActivePlayer - 1].role === 'Мафия' ||
										players[numberOfActivePlayer - 1].role === 'Дон'
											? `(${
													players[
														players.findIndex(
															({ id, role }) =>
																(role === 'Мафия' || role === 'Дон') &&
																id !== players[numberOfActivePlayer - 1].id
														)
													].name
											  } - ${
													players[
														players.findIndex(
															({ id, role }) =>
																(role === 'Мафия' || role === 'Дон') &&
																id !== players[numberOfActivePlayer - 1].id
														)
													].role
											  })`
											: ``
									}`}
							</h4>
							<div>Оставшееся время {timeRemaining}</div>
							<div>
								{!dayIsOver && (
									<button
										className={`enter ${dayIsOver ? 'noDisplay' : ''}`}
										onClick={nextPlayerHandler}
									>
										Передать следующему игроку(
										{players[numberOfActivePlayer]?.name})
									</button>
								)}
								<button
									className={`enter ${dayIsOver ? '' : 'noDisplay'}`}
									onClick={startExposeOnEjection}
								>
									Начать выставление на голосование
								</button>
							</div>
						</div>
					)}
					{/* {Здесь начинается компонент выставления на голосование} */}
					{gameIsStarted && exposeOnEjectionIsGoing && (
						<div
							className={`${
								gameIsStarted && exposeOnEjectionIsGoing ? '' : 'noDisplay'
							}`}
						>
							<h1>
								{players[numberOfActivePlayer - 1].name}, выберете игрока на
								голосование
							</h1>
							<ul>
								{playersVoices.map((player, index) => {
									if (index !== numberOfActivePlayer - 1) {
										return (
											<li key={index}>
												<span>
													{player.name} - {index + 1} игрок
												</span>
												<button
													className='delete'
													id={player.id}
													onClick={exposeHandler}
												>
													выставить на голосование
												</button>
											</li>
										)
									}
								})}
							</ul>
							<button
								className={`enter ${exposeIsOver ? 'noDisplay' : ''}`}
								onClick={nextPlayerOnExposeEjectionHandler}
							>
								Воздержаться и передать следующему игроку(
								{players[numberOfActivePlayer]?.name})
							</button>
							<button
								className={`enter ${exposeIsOver ? '' : 'noDisplay'}`}
								onClick={checkOnVoices}
							>
								Воздержаться
							</button>
						</div>
					)}
					{/* {Здесь начинается компонент голосования} */}
					{gameIsStarted && ejectionIsGoing && (
						<div
							className={`${
								gameIsStarted && ejectionIsGoing ? '' : 'noDisplay'
							}`}
						>
							<h1>
								{players[numberOfActivePlayer - 1].name}, выберете игрока на
								выбывание
							</h1>
							<ul>
								{playersVoices.map((player, index) => (
									<li key={index}>
										<span>
											{player?.name} - {index + 1} игрок
										</span>
										<button
											className='delete'
											id={player.id}
											onClick={ejectionHandler}
										>
											проголосовать за выбывание
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
					{gameIsStarted && ejectionIsOver && (
						<button
							className={`enter ${ejectionIsOver ? '' : 'noDisplay'}`}
							onClick={calculateVoices}
						>
							Подвести итог
						</button>
					)}
					{/* {Промежуточный компонент} */}
					{intervalIsOpened && (
						<div>
							<div>
								{playersVoices.length > 1 ? (
									<>
										<h1>Голоса разделились поровну между:</h1>
										<ul>
											{playersVoices.map((player, index) => (
												<li key={index}>
													<span>
														{player?.name} - {index + 1} игрок
													</span>
												</li>
											))}
										</ul>
										<button className='enter' onClick={startDefence}>
											Перейти к защите, начиная с {playersVoices[0].name}
										</button>
									</>
								) : (
									<>
										<h1>{playersVoices[0].name}, вам не поверили</h1>
										<button className='enter' onClick={lastMinute}>
											Взять последнюю минуту на прощание
										</button>
									</>
								)}
							</div>
						</div>
					)}
					{/* {компонент последней минуты} */}
					{lastMinuteIsGoing && (
						<div>
							<h1>{playersVoices[0].name}</h1>
							<div>Оставшееся время {timeRemaining}</div>
							<button className='enter' onClick={startNight}>
								начать ночь
							</button>
						</div>
					)}
					{/* {компонент защиты на голосовании} */}
					{gameIsStarted && defenceIsGoing && (
						<div
							className={`${
								gameIsStarted && defenceIsGoing ? '' : 'noDisplay'
							}`}
						>
							<h1>Докажите свою невиновность</h1>
							<h4>
								Игрок номер {numberOfActivePlayer} -{' '}
								{playersVoices[numberOfActivePlayer - 1].name}
							</h4>

							<div>Оставшееся время {timeRemaining}</div>
							<div>
								{!defenceIsOver && (
									<button
										className={`enter ${defenceIsOver ? 'noDisplay' : ''}`}
										onClick={nextDefencerHandler}
									>
										Передать следующему обвиняемому(
										{playersVoices[numberOfActivePlayer].name})
									</button>
								)}
								{defenceIsOver && (
									<button
										className={`enter ${defenceIsOver ? '' : 'noDisplay'}`}
										onClick={startEjection}
									>
										Начать голосование
									</button>
								)}
							</div>
						</div>
					)}
					{/* {Компонент ночи} */}
					{nightIsGoing && (
						<div>
							<h1>{numberRound} ночь</h1>
							<h4>
								Игрок номер {numberOfActivePlayer} -{' '}
								{players[numberOfActivePlayer - 1].name}
							</h4>
							<button
								className={`enter ${isRoleShowing ? 'noDisplay' : ''}`}
								onClick={roleShowingHandler}
							>
								Показать роль
							</button>
							<button
								className={`enter ${isRoleShowing ? '' : 'noDisplay'}`}
								onClick={roleShowingHandler}
							>
								Скрыть роль
							</button>
							<h4 className={`${isRoleShowing ? '' : 'noDisplay'}`}>
								Ваша роль - {players[numberOfActivePlayer - 1].role}
							</h4>
							{isRoleShowing && (
								<div>
									{players[numberOfActivePlayer - 1].role === 'Мафия'
										? !isRoleTaskComplited && (
												<ul>
													{players.map((player, index) => (
														<li key={index}>
															<span>
																{player?.name} - {index + 1} игрок
															</span>
															<button
																className='delete'
																id={player.id}
																onClick={visit}
															>
																зайти 'поговорить'
															</button>
														</li>
													))}
												</ul>
										  )
										: players[numberOfActivePlayer - 1].role === 'Дон'
										? (!isRoleTaskComplited && (
												<ul>
													{players.map((player, index) => (
														<li key={index}>
															<span>
																{player?.name} - {index + 1} игрок
															</span>
															<button
																className='delete'
																id={player.id}
																onClick={visit}
															>
																зайти 'поговорить'
															</button>
														</li>
													))}
												</ul>
										  )) ||
										  (isRoleTaskComplited && !role && (
												<ul>
													{players.map((player, index) => (
														<li key={index}>
															<span>
																{player?.name} - {index + 1} игрок
															</span>
															<button
																className='delete'
																id={player.id}
																onClick={checkRole}
															>
																Проверить на шефство
															</button>
														</li>
													))}
												</ul>
										  )) || <div>{role}</div>
										: players[numberOfActivePlayer - 1].role === 'Шериф'
										? (!role && (
												<ul>
													{players.map((player, index) => (
														<li key={index}>
															<span>
																{player?.name} - {index + 1} игрок
															</span>
															<button
																className='enter'
																id={player.id}
																onClick={checkRole}
															>
																Проверить роль
															</button>
														</li>
													))}
												</ul>
										  )) || <div>{role}</div>
										: (isCorrect === 2 && (
												<div>
													{mran1} + {mran2} = ?
													<div>
														<button
															className='enter'
															id={mr - 1}
															onClick={checkAnswer}
														>
															{mr - 1}
														</button>
														<button
															className='enter'
															id={mr}
															onClick={checkAnswer}
														>
															{mr}
														</button>
														<button
															className='enter'
															id={mr + 1}
															onClick={checkAnswer}
														>
															{mr + 1}
														</button>
													</div>
												</div>
										  )) ||
										  (isCorrect === 1 && <div>Все верно, молодец</div>) ||
										  (isCorrect === 0 && (
												<div>0_o как можно здесь ошибиться?</div>
										  ))}
								</div>
							)}
							<div>
								<button
									className={`enter ${nightIsOver ? 'noDisplay' : ''}`}
									onClick={nextPlayerAtNightHandler}
								>
									Передать следующему игроку(
									{players[numberOfActivePlayer]?.name})
								</button>
								<button
									className={`enter ${nightIsOver ? '' : 'noDisplay'}`}
									onClick={endNight}
								>
									Закончить ночь
								</button>
							</div>
						</div>
					)}
					{/* {промежуточный компонент} */}
					{nightIsEnd && (
						<div>
							<h1>
								Этой ночью{' '}
								{isMurder
									? `${killedPlayer.name} покинул нас`
									: 'никто не умер'}
							</h1>
							<button className='enter' onClick={startDay}>
								начать день
							</button>
						</div>
					)}
				</div>
			)}
			{/* {Экран победы} */}
			{gameIsEnd && (
				<div>
					<h1>{countOfMafia !== 0 ? 'Победила мафия' : 'Победили мирные'}</h1>
					<ul>
						{mafia.map((player, index) =>
							player?.name ? (
								<li key={index}>
									<span>
										{player?.name} - {player?.role}
									</span>
								</li>
							) : (
								''
							)
						)}
					</ul>
					<button className='enter' onClick={returnOnStart}>
						Вернуться в начало
					</button>
				</div>
			)}
			{/* <Routes>
				<Route path='/home' element={<Home />}></Route>
			</Routes> */}
		</>
	)
}

export default MainPage
