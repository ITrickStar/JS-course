const axios = require('axios');
const yargs = require('yargs');

const argv = yargs
    .command('get', 'Получить прогноз погоды для выбранного города', {
        city: {
            describe: 'City to search',
            demand: true,
            alias: 's',
        },
        token: {
            describe: 'Token to use',
            demand: false,
            alias: 't',
        },
    })
    .help()
    .argv;

if (argv._[0] === 'get') {
    const city = encodeURIComponent(argv.city);
    const token = argv.token;
    var API_KEY = (token) ? encodeURIComponent(argv.token) : '5bb9f5ae90aa8d2c3b9db268955cf1ed';

    (async () => {
        try {
            const cityAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;    // API для получения координат по городу

            const response = await axios.get(cityAPIUrl);
            const cityData = response.data;
            const lat = cityData[0].lat;
            const lon = cityData[0].lon;

            if (lat && lon) {
                const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;    // API для получения координат по городу

                const weatherResponse = await axios.get(weatherAPIUrl);
                const weatherData = weatherResponse.data;
                console.log(`Погода в ${weatherData.name}:`);
                for (const key in weatherData.main) {
                    console.log(`${key}: ${weatherData.main[key]}`);
                }
            }
            else
                throw new Error('Координаты по городу не найдены');
        } catch (error) {
            console.error('Ошибка при получении данных о погоде:', error.message);
        }
    })();
} else {
    console.log('Используйте команду "get" для получения прогноза погоды. Запустите с флагом --help для справки.');
}
