import { Article } from "@models/article/article";
import { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";
import {
  ArticleDependencyValidator,
  CommentDependencyValidator,
} from "./dependency-validator";

export default interface ArticleLogic {
  getArticleById(articleId: ObjectID): Promise<DocumentType<Article>>;
  getArticleByTitle(title: string): Promise<DocumentType<Article>[]>;
  createArticle(
    authorId: ObjectID,
    title: string,
    content: string,
    dependencyValidator: ArticleDependencyValidator
  ): Promise<DocumentType<Article>>;
  updateArticle(
    articleId: ObjectID,
    newData: Article
  ): Promise<DocumentType<Article>>;
  deleteArticle(articleId: ObjectID): Promise<boolean>;
  getCommentsForArticle(
    articleId: ObjectID,
    limit: number,
    from?: ObjectID
  ): Promise<DocumentType<Comment>[]>;
}
