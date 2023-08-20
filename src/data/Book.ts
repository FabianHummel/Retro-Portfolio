export interface Heading {
	title: string;
	children?: Array<Entry>;
}

export interface Article {
	title: string;
	path: string;
	children?: Array<Entry>;
}

export type Entry = Heading | Article;

export const Entries: Array<Entry> = [
	{
		title: "Projects",
		path: "projects.md",
		children: [
			{
				title: "Heast Messenger",
				path: "heast-messenger.md",
				children: [
					{
						title: "Security Layers",
						path: "heast-messenger/security-layers.md"
					}
				],
			},
			{
				title: "Table Tennis",
				path: "table-tennis.md",
				children: [
					{
						title: "ECS",
						path: "table-tennis/ecs.md"
					}
				],
			}
		]
	},
	{
		title: "Blog",
		path: "blog.md"
	},
	{
		title: "Random stuff",
		path: "misc.md"
	}
]

const filterArticles = (entry: Entry): entry is Article => 'path' in entry;

const getArticles = (article: Article): Article[] => {
	const articles = article.children?.filter(filterArticles).flatMap(getArticles) ?? [];
  return [article, ...articles];
};

export const Articles = Entries
	.filter(filterArticles)
	.flatMap((e) => getArticles(e))