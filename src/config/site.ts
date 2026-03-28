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
		en: 'Jjamjjamtive overprivileged child',
		ko: '짬짬한 고능아',
	},
	name: 'Min-Seong Park',
	nameKr: '박민성',
	/** HTML 허용 */
	introHtml: {
		en: `Grade 10 at <strong>FEIA</strong>, building towards <strong>University of Waterloo Engineering</strong>.`,
		ko: `<strong>FEIA</strong> 10학년이며 <strong>워털루 대학교 공학 대학교</strong>를 목표로 하고 있습니다.`,
	},
	githubUrl: 'https://github.com/pelu10075',
	contactCta: { en: 'Contact Me', ko: '연락하기' } satisfies LocaleText,
	scrollLabel: { en: 'Scroll', ko: 'Scroll' } satisfies LocaleText,
} as const;

export const about = {
	sectionLabel: { en: 'About', ko: '소개' } satisfies LocaleText,
	title: { en: 'Who I Am', ko: '자기소개' } satisfies LocaleText,
	/** 각 항목은 HTML 허용 (문단 쌍) */
	paragraphsHtml: [
		{
			en: `I'm a <strong>Grade 10 student at FEIA</strong> (Fort Erie International Academy).`,
			ko: `저는 <strong>FEIA</strong>(Fort Erie International Academy)에 재학 중인 <strong>10학년</strong>입니다.`,
		},
		{
			en: `eeeeee`,
			ko: `이.`,
		},
	] satisfies LocaleText[],
	stats: [
		{ value: '10th', label: { en: 'Grade', ko: '학년' } },
		{ value: '4+', label: { en: 'GitHub Repos', ko: 'GitHub 저장소' } },
		{ value: 'Python', label: { en: 'Primary Lang', ko: '주요 언어' } },
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
			icon: 'C++',
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
			icon: 'crypto',
			name: 'Cryptography',
			tags: ['DES', 'AES', 'block ciphers'],
			description: {
				en: 'Classical and modern ciphers.',
				ko: '고전·현대 암호.',
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
				en: `A from-scratch implementation of the Data Encryption Standard (DES) in Python. Key scheduling,
					Feistel rounds, and S-box substitutions with a focus on correctness and readability.`,
				ko: `Python으로 DES(Data Encryption Standard)를 처음부터 구현했습니다. 키 스케줄, Feistel 라운드, S-box
					대체에 중점을 두었습니다.`,
			},
			sourceUrl: 'https://github.com/pelu10075/DES',
			tags: ['Cryptography', 'Python'],
		},
		{
			title: { en: 'Portfolio Site', ko: '포트폴리오 사이트' },
			description: {
				en: `This portfolio — responsive. Built with Astro and hosted on GitHub Pages.`,
				ko: `이 포트폴리오 — 반응형입니다. Astro로 제작, GitHub Pages에 호스팅.`,
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
			en: `eeeee`,
			ko: `ㅇㅇ;;`,
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
			href: 'mailto:edward_10@nate.com',
			label: 'edward_10@nate.com',
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

/** 상단 네비 로고: `//` + slug 형태 */
export const siteLogo = {
	prefix: '//',
	slug: 'msp',
	ariaLabel: 'Home',
} as const;

/** 푸터: `{{year}}` 는 배포 연도로 치환됩니다 */
export const siteFooter = {
	line1: {
		en: '© {{year}} Min-Seong Park. Astro + GitHub Pages.',
		ko: '© {{year}} 박민성. Astro + GitHub Pages.',
	},
	line2: {
		en: 'Aspiring UWaterloo Engineer · FEIA Class of 2028',
		ko: 'UWaterloo 공학도를 지향 · FEIA 2028 졸업 예정',
	},
} as const;

export function formatFooterYear(text: string, year: number) {
	return text.replace(/\{\{year\}\}/g, String(year));
}
