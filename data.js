const categories = {
    all: { label: 'Все', class: 'category-all' },
    movie: { label: 'Фильмы', class: 'category-movie' },
    series: { label: 'Сериалы', class: 'category-series' },
    cartoon: { label: 'Мультфильмы', class: 'category-cartoon' },
    'animated-series': { label: 'Мультсериалы', class: 'category-animated-series' },
    anime: { label: 'Аниме', class: 'category-anime' },
    show: { label: 'Шоу', class: 'category-show' }
};

const movies = [
    {
        id: 1,
        title: 'Formula 1',
		subtitle: 'Гран-При 2025',
		trailer: 'https://www.youtube.com/watch?v=OlEqHXRrcpc',
        category: 'show',
        type: 'single',
        poster: 'https://cdn.ananasposter.ru/image/cache/catalog/poster/cars/81/15101-1000x830.jpg',
        description: [
		'Формула-1 — чемпионат мира по кольцевым автогонкам, который проводится ежегодно и состоит из этапов, в соответствии с техническими нормами, требованиями и правилами, установленными Международной автомобильной федерацией.',
        ],
		link: 'https://rutube.ru/u/versporta/videos/'
    },
	{
        id: 2,
        title: 'Devil May Cry',
		trailer: 'https://rutube.ru/video/f63afe34bc29f2835af8affb8d1c3303/',
        category: 'anime',
        type: 'riser',
        poster: 'https://preview.redd.it/83bumshoj6oe1.jpeg?auto=webp&s=8c212001dd262e141bd864d60d2d7d4e1ce0b8a4',
		description: [ 
		'Загадочный злодей замышляет открыть врата ада, и единственной надеждой на спасение человечества становится чертовски обаятельный охотник на демонов.',
        ],
		releaseDate: '3 апреля'
    },
	{
        id: 3,
        title: 'Daredevil: Born Again',
		subtitle: 'Сорвиголова: Рождённый заново',
		trailer: 'https://www.youtube.com/watch?v=OlEqHXRrcpc',
        category: 'series',
        type: 'seasons',
        poster: 'https://images.justwatch.com/poster/324505167/s718/daredevil-born-again.jpg',
        description: [
		'Слепому адвокату Мэтту Мёрдоку снова приходится облачиться в костюм Сорвиголовы, чтобы противостоять криминальному авторитету Уилсону Фиску, который решил занять пост мэра Нью-Йорка.',
        ],
		seasons: [
        {
            season: 1,
            episodes: [
				{ num: 1, link: 'https://mediaaly.pro/tvseries/0eaf38e6cde9eed6d6df15219e069fbd38ca1cf6/a25be3e9513ce2a1bb578a87455d19b0:2025032213/1080.mp4:hls:manifest.m3u8'},
				{ num: 2, link: 'https://mediaaly.pro/tvseries/111d22a01b2b010a9b37b32b075974b1f4818d8d/4d076d0d2a0d5be32a36c0c1daab654e:2025032214/1080.mp4:hls:manifest.m3u8'},
				{ num: 3, link: 'https://mediaaly.pro/tvseries/efbc147c4c16edf33fc1ceeaae39974273fd4c69/f89a0dc35a854a25868390b49ad26576:2025032213/1080.mp4:hls:manifest.m3u8'},
			]
		},
	]
},
    {
        id: 4,
        title: 'John Wick',
		subtitle: 'Вселенная Джона Уика',
		trailer: 'https://www.youtube.com/watch?v=OlEqHXRrcpc',
        category: 'movie',
        type: 'franchise',
        poster: 'https://www.yourdecoration.com/cdn/shop/files/Poster-John-Wick-Weapon-Church-61x91-5cm-PP2401047_cdf91a34-5b7b-4058-b049-17a1d3801455.jpg?v=1739864565',
        description: [
        'Джон Уик: На первый взгляд, самый обычный среднестатистический американец, который ведет спокойную мирную жизнь. Однако мало кто знает, что он был наёмным убийцей, причём одним из лучших профессионалов в своём деле. После смерти жены и кражи его легендарного Mustang 1969 года, Джон вынужден вернуться в криминальный мир.',
		'Джон Уик 2: Когда бывший коллега Джона решает взять под свой контроль таинственную гильдию убийц, Уик вынужден выйти из отставки. Ведомый кровавой клятвой Джон отправляется в Рим, где ему придется сразиться с одними из самых опасных киллеров в мире.',
		'Джон Уик 3: После нарушения кодекса тайной гильдии ассасинов получает статус изгоя — экскомьюникадо. За его голову назначена цена в 14 миллионов долларов, и армия самых жестоких профессиональных убийц со всего мира открывает на него кровавую охоту.',
		'Джон Уик 4: Оставляя за собой горы трупов, Джон Уик продолжает скрываться от всевозможных наёмных убийц, и теперь охоту на него возглавляет молодой и честолюбивый член Правления по имени Маркиз. Два управляющих отелями «Континенталь» в Нью-Йорке и Осаке, решившие по старой дружбе помочь своенравному киллеру, уже жестоко за это поплатились, но внезапно Джон узнаёт способ выбраться из этой, казалось бы, безвыходной ситуации.'
		],
		parts: [
            { name: 'Джон Уик', link: '' },
			{ name: 'Джон Уик 2', link: '' },
			{ name: 'Джон Уик 3: Парабеллум', link: '' },
            { name: 'Джон Уик 4', link: '' }
        ]
    },
	
];

function getCategoryLabel(category) {
    return categories[category]?.label || '';
}
