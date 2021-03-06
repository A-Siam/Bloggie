import { commentDependencyValidator } from "@services/data-interaction/comment/dependency-validator";
import CommentsLogic from "@services/data-interaction/comment/comments-logic";
import CommentsLogicImpl from "@services/data-interaction/comment/comments-logic-impl";
import { Comment } from "@models/article/comments";
import articleCreation from "@tests/utils/articles/article-creation";
import setupTeardown from "@tests/utils/data-interaction/setup-teardown";
import InvalidInputError from "@utils/api/user-input-error";
import { ObjectID } from "mongodb";

describe("Comments data interaction test suit", () => {
  setupTeardown();
  test("should create comment successfully", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    expect(comment).toBeTruthy();
    expect(comment.content).toEqual(content);
    // @ts-ignore
    expect(comment.author._id).toEqual(user._id);
    // @ts-ignore
    expect(comment.article._id).toEqual(article._id);
  });

  test("should mirror id to commentId", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    expect(comment).toBeTruthy();
    expect(comment._id).toEqual(comment.commentId);
  });

  test("should reject creation of invalid comment", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay!";
    const tempComment = new Comment();
    tempComment.content = content;
    try {
      const comment = await commentsLogic.addComment(
        article._id,
        user._id,
        tempComment,
        commentDependencyValidator
      );
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });

  test("should reject creating comment with invalid author", async () => {
    const { article } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    try {
      await commentsLogic.addComment(
        article._id,
        new ObjectID(),
        tempComment,
        commentDependencyValidator
      );
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });

  test("should reject creating comment with invalid article id", async () => {
    const { user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    try {
      await commentsLogic.addComment(
        new ObjectID(),
        user._id,
        tempComment,
        commentDependencyValidator
      );
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });

  test("should update comment", async () => {
    const { article, user } = await articleCreation();
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "the best thing in this world!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    const newComm = new Comment();
    newComm.content = content;
    const res = await commentLogic.updateComment(comment._id, newComm);
    expect(res).toBeTruthy();
    expect(res.content).toEqual(content);
    // @ts-ignore
    expect(res.author._id).toEqual(comment.author._id);
    // @ts-ignore
    expect(res.article._id).toEqual(comment.article._id);
  });

  test("should reject updating comment with invalid length", async () => {
    const { article, user } = await articleCreation();
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "t";
    const tempComment = new Comment();
    tempComment.content = "the best thing in this world";
    const comment = await commentLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    const newComm = new Comment();
    newComm.content = content;
    try {
      const res = await commentLogic.updateComment(comment._id, newComm);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });

  test("should reject updating comment with invalid id", async () => {
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    try {
      const newComm = new Comment();
      newComm.content = "very long comment but it doesn't matter";
      await commentLogic.updateComment(new ObjectID(), newComm);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });

  test("should delete comment", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    const done = await commentsLogic.deleteComment(comment._id);
    expect(done).toBeTruthy();
    try {
      const c = await commentsLogic.getCommentById(comment._id);
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });

  test("should reject deletion of invalid comment id", async () => {
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const res = await commentLogic.deleteComment(new ObjectID());
    expect(res).toBe(false);
  });

  test("should get comment by id", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    const resComment = await commentsLogic.getCommentById(comment._id);
    expect(resComment.content).toEqual(comment.content);
    // @ts-ignore
    expect(resComment.author.userId).toEqual(comment.author._id);
    // @ts-ignore
    expect(resComment.article.articleId).toEqual(comment.article._id);
  });

  test("should reject getting comment by invalid id", async () => {
    try {
      const commentLogic: CommentsLogic = new CommentsLogicImpl();
      await commentLogic.getCommentById(new ObjectID());
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError);
    }
  });
});
