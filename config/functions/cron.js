module.exports = {
  "*/1 * * * *": async () => {
    // fetch articles to publish
    const draftArticleToPublish =
      await strapi.api.article.services.article.find({
        _publicationState: "preview", // preview returns both draft and published entries
        published_at_null: true, // so we add another condition here to filter entries that have not been published
        publish_at_lt: new Date(),
      });

    // update published_at of articles
    await Promise.all(
      draftArticleToPublish.map((article) => {
        return strapi.api.article.services.article.update(
          { id: article.id },
          { publishedAt: new Date() }
        );
      })
    );
  },
};
