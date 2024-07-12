import {BookEntries} from "@src/generated/book-entries";

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

const filterArticles = (entry: Entry): entry is Article => 'path' in entry;

const getArticles = (article: Article): Article[] => {
	const articles = article.children?.filter(filterArticles).flatMap(getArticles) ?? [];
	return [article, ...articles];
};

export const Articles = BookEntries
	.filter(filterArticles)
	.flatMap((e) => getArticles(e));

export const getArticleHref = (article: Article) => article.path.replace(/\.md$/, '');