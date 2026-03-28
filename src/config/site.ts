/**
 * 포트폴리오 표시 내용 — 여기만 수정하면 홈 페이지 문구/링크가 바뀝니다.
 * HTML이 필요한 문단은 <strong> 같은 태그를 문자열 안에 넣을 수 있습니다.
 */
export type LocaleText = { en: string; ko: string };

export const siteMeta = {
	title: 'Min-Seong Park | Portfolio',
	description: 'Software developer & algorithm enthusiast — FEIA, targeting UWaterloo.',
} as const;

export const hero = {
	tagline: {
		en: 'Software Developer & Algorithm Enthusiast',
		ko: '소프트웨어 개발자 · 알고리즘 애호가',
	},
	name: 'Min-Seong Park',
	nameKr: '박민성',
	/** HTML 허용 */
	introHtml: {
		en: `Grade 10 at <strong>FEIA</strong>, building towards <strong>University of Waterloo Engineering</strong>.
				I write clean systems in Python &amp; C++, design backends with FastAPI, and sharpen my edge through
				competitive programming.`,
		ko: `<strong>FEIA</strong> 고등학교 10학년이며 <strong>워털루 대학교 공학</strong>을 목표로 합니다. Python과
				C++로 안정적인 시스템을 작성하고, FastAPI로 백엔드를 설계하며, 경쟁 프로그래밍으로 문제 해결력을 키웁니다.`,
	},
	githubUrl: 'https://github.com/pelu10075',
	contactCta: { en: 'Contact Me', ko: '연락하기' } satisfies LocaleText,
	scrollLabel: { en: 'Scroll', ko: '스크롤' } satisfies LocaleText,
} as const;

export const about = {
	sectionLabel: { en: 'About', ko: '소개' } satisfies LocaleText,
	title: { en: 'Who I Am', ko: '나는 누구인가' } satisfies LocaleText,
	/** 각 항목은 HTML 허용 (문단 쌍) */
	paragraphsHtml: [
		{
			en: `I'm a <strong>Grade 10 student at FEIA</strong> (Foreign Engineering &amp; International Academy),
				passionate about computer science and software engineering from a young age.`,
			ko: `저는 <strong>FEIA</strong>(Foreign Engineering &amp; International Academy)에 재학 중인 <strong>고등학교 10학년</strong>으로, 어릴 때부터 컴퓨터 과학과 소프트웨어 공학에 관심이 많습니다.`,
		},
		{
			en: `My goal is to pursue <strong>Computer Engineering at the University of Waterloo</strong> — one of
				the world's top programs for hands-on, co-op-driven engineering education.`,
			ko: `목표는 <strong>워털루 대학교 컴퓨터공학</strong>입니다. 현장 중심·코업으로 유명한 세계적인 공학
				프로그램입니다.`,
		},
		{
			en: `I explore <strong>algorithms and data structures</strong> through competitive programming, build
				lightweight <strong>REST APIs</strong> with FastAPI, and implement low-level systems in <strong>C++</strong>.
				I'm particularly drawn to cryptography and security.`,
			ko: `경쟁 프로그래밍으로 <strong>알고리즘과 자료구조</strong>를 익히고, FastAPI로 가벼운 <strong>REST API</strong>를
				만들며, <strong>C++</strong>로 저수준 시스템을 구현합니다. 암호와 보안에 특히 끌립니다.`,
		},
	] satisfies LocaleText[],
	stats: [
		{ value: '10th', label: { en: 'Grade — FEIA', ko: '학년 — FEIA' } },
		{ value: '4+', label: { en: 'GitHub Repos', ko: 'GitHub 저장소' } },
		{ value: 'C++', label: { en: 'Primary Lang', ko: '주요 언어' } },
		{ value: 'UW', label: { en: 'Target University', ko: '목표 대학' } },
	],
} as const;

export type SkillItem = {
	icon: string;
	name: string;
	tags: string[];
	description: LocaleText;
};

export const skillsSection = {
	sectionLabel: { en: 'Skills', ko: '기술' } satisfies LocaleText,
	title: { en: 'Tech Stack', ko: '기술 스택' } satisfies LocaleText,
	items: [
		{
			icon: 'py',
			name: 'Python',
			tags: ['scripting', 'automation', 'data'],
			description: {
				en: 'Scripting, automation, data processing, and rapid prototyping.',
				ko: '스크립트, 자동화, 데이터 처리, 빠른 프로토타이핑.',
			},
		},
		{
			icon: 'c++',
			name: 'C++',
			tags: ['systems', 'STL', 'competitive'],
			description: {
				en: 'Systems programming, competitive problem solving, memory-level control.',
				ko: '시스템 프로그래밍, 경쟁 프로그래밍, 메모리 수준 제어.',
			},
		},
		{
			icon: '∑',
			name: 'Algorithms',
			tags: ['DP', 'graphs', 'BFS/DFS', 'greedy'],
			description: {
				en: 'Graph theory, dynamic programming, sorting, and complexity analysis.',
				ko: '그래프 이론, 동적 계획법, 정렬, 복잡도 분석.',
			},
		},
		{
			icon: 'api',
			name: 'FastAPI',
			tags: ['REST', 'async', 'OpenAPI'],
			description: {
				en: 'RESTful backend services with async Python and auto-generated docs.',
				ko: '비동기 Python 기반 REST 백엔드와 자동 생성 문서.',
			},
		},
		{
			icon: '🔐',
			name: 'Cryptography',
			tags: ['DES', 'AES', 'block ciphers'],
			description: {
				en: 'Classical and modern ciphers — including a full DES implementation.',
				ko: '고전·현대 암호 — DES 전체 구현 포함.',
			},
		},
		{
			icon: '⚙',
			name: 'Tooling',
			tags: ['Git', 'GitHub', 'CLI'],
			description: {
				en: 'Git version control, GitHub workflows, and command-line development.',
				ko: 'Git, GitHub 워크플로, CLI 개발.',
			},
		},
	] satisfies SkillItem[],
} as const;

export type ProjectEntry = {
	/** 한 언어와 동일하면 문자열 하나만 */
	title: LocaleText | string;
	description: LocaleText;
	sourceUrl: string;
	tags: string[];
};

export const projectsSection = {
	sectionLabel: { en: 'Projects', ko: '프로젝트' } satisfies LocaleText,
	title: { en: "What I've Built", ko: '만들어 온 것들' } satisfies LocaleText,
	viewSource: { en: 'View Source', ko: '소스 보기' } satisfies LocaleText,
	items: [
		{
			title: { en: 'DES Implementation', ko: 'DES 구현' },
			description: {
				en: `A from-scratch implementation of the Data Encryption Standard (DES) in Python/C++. Key scheduling,
					Feistel rounds, and S-box substitutions with a focus on correctness and readability.`,
				ko: `Python/C++로 DES(Data Encryption Standard)를 처음부터 구현했습니다. 키 스케줄, Feistel 라운드, S-box
					대체에 중점을 두었습니다.`,
			},
			sourceUrl: 'https://github.com/pelu10075/DES',
			tags: ['Cryptography', 'Python'],
		},
		{
			title: 'munseong_api',
			description: {
				en: `A personal REST API backend built with FastAPI — async endpoints, structured routing, and
					auto-generated OpenAPI documentation.`,
				ko: `FastAPI로 만든 개인 REST API 백엔드 — 비동기 엔드포인트, 구조화된 라우팅, 자동 OpenAPI 문서.`,
			},
			sourceUrl: 'https://github.com/pelu10075/munseong_api',
			tags: ['FastAPI', 'Python', 'Backend'],
		},
		{
			title: { en: 'MMSCP Project', ko: 'MMSCP 프로젝트' },
			description: {
				en: `A multi-module project demonstrating structured software design and algorithmic problem solving in
					C++ or Python.`,
				ko: `C++ 또는 Python으로 구조적 설계와 알고리즘 문제 해결을 보여 주는 다중 모듈 프로젝트입니다.`,
			},
			sourceUrl: 'https://github.com/pelu10075/MMSCP_Project',
			tags: ['C++', 'Algorithms'],
		},
		{
			title: { en: 'Portfolio Site', ko: '포트폴리오 사이트' },
			description: {
				en: `This portfolio — fast, minimal, responsive. Built with Astro and hosted on GitHub Pages.`,
				ko: `이 포트폴리오 — 빠르고 미니멀하며 반응형입니다. Astro로 제작, GitHub Pages에 호스팅.`,
			},
			sourceUrl: 'https://github.com/pelu10075/pelu10075.github.io',
			tags: ['Astro', 'GitHub Pages'],
		},
	] satisfies ProjectEntry[],
} as const;

export const competitive = {
	sectionLabel: { en: 'Competitive Programming', ko: '경쟁 프로그래밍' } satisfies LocaleText,
	title: { en: 'Algorithm Grind', ko: '알고리즘 그라인드' } satisfies LocaleText,
	paragraphsHtml: [
		{
			en: `Competitive programming is how I push the limits of algorithmic thinking. Through platforms like <strong>Baekjoon</strong>, I tackle problems from graph traversal and dynamic programming to number theory and trees.`,
			ko: `경쟁 프로그래밍은 알고리즘적 사고의 한계를 밀어 올리는 방법입니다. <strong>백준</strong> 같은 플랫폼에서 그래프 탐색·DP부터 정수론·트리 문제까지 다룹니다.`,
		},
		{
			en: `Consistent problem solving builds the mental model needed to design efficient, correct software.`,
			ko: `꾸준한 문제 풀이는 효율적이고 올바른 소프트웨어를 설계하는 데 필요한 사고 모델을 만듭니다.`,
		},
	] satisfies LocaleText[],
	profileLinkLabel: { en: 'View solved.ac Profile ↗', ko: 'solved.ac 프로필 보기 ↗' } satisfies LocaleText,
	badge: {
		imageUrl: 'https://mazassumnida.wtf/api/v2/generate_badge?boj=edward_10',
		alt: "edward_10's solved.ac stats",
		profileUrl: 'https://solved.ac/profile/edward_10',
		handle: '@edward_10',
	},
} as const;

export const blogSection = {
	sectionLabel: { en: 'Writing', ko: '글' } satisfies LocaleText,
	title: { en: 'Blog', ko: '블로그' } satisfies LocaleText,
	empty: {
		en: 'No posts yet — visit the blog →',
		ko: '아직 글이 없습니다 — 블로그로 이동 →',
	} satisfies LocaleText,
	allPosts: { en: 'All Posts →', ko: '전체 글 →' } satisfies LocaleText,
} as const;

export const contactSection = {
	sectionLabel: { en: 'Contact', ko: '연락' } satisfies LocaleText,
	headingLine1: { en: "Let's connect.", ko: '연락 주세요.' } satisfies LocaleText,
	headingLine2: {
		en: `I'm always open to opportunities,<br />collaborations, and new ideas.`,
		ko: `기회와 협업, 새로운 아이디어는<br />언제나 환영합니다.`,
	} satisfies LocaleText,
	links: [
		{
			href: 'mailto:peullutv4@gmail.com',
			label: 'peullutv4@gmail.com',
			icon: 'mail' as const,
		},
		{
			href: 'https://github.com/pelu10075',
			label: 'github.com/pelu10075',
			icon: 'github' as const,
		},
		{
			href: 'https://solved.ac/profile/edward_10',
			label: 'solved.ac/@edward_10',
			icon: 'solved' as const,
		},
	],
} as const;

/** reveal 애니메이션 stagger (기존 디자인과 동일한 순환) */
export const revealDelays = ['1', '2', '3', '4'] as const;

export function projectTitleSpans(title: ProjectEntry['title']) {
	if (typeof title === 'string') {
		return { mode: 'single' as const, text: title };
	}
	return { mode: 'i18n' as const, title };
}
