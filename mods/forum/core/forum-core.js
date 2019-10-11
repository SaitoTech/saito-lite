const sqlite = require('sqlite');
const ModTemplate = require('../../../lib/templates/modtemplate.js');
const fs = require('fs');

class ForumCore extends ModTemplate {
  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Forum";

    this.db = {***REMOVED***;
    this.post_limiter = 25;
  ***REMOVED***

  // Install Module //
  async installModule() {
    try {
      this.db = await sqlite.open('./data/forum.sq3');

      let forum_posts_sql = fs.readFileSync('./data/sql/forum/forum-posts.sql').toString();
      let forum_comments_sql = fs.readFileSync('./data/sql/forum/forum-comments.sql').toString();
      let forum_votes_sql = fs.readFileSync('./data/sql/forum/forum-votes.sql').toString();

      await Promise.all([
        this.db.run(forum_posts_sql, {***REMOVED***),
        this.db.run(forum_comments_sql, {***REMOVED***),
        this.db.run(forum_votes_sql, {***REMOVED***),
      ]);
***REMOVED*** catch (err) { console.error(err); ***REMOVED***
  ***REMOVED***;

  async initialize() {
    this.db = await sqlite.open('./data/forum.sq3');
  ***REMOVED***

  onConfirmation(blk, tx, conf, app) {
    if (tx.transaction.msg.module != "Forum") { return; ***REMOVED***
    if (conf == 0) {
      let forum = app.modules.returnModule("Forum");
      switch (tx.transaction.msg.type) {
        case 'post':
          forum.savePost(tx);
          break;
        case 'comment':
          let { post_id, parent_id ***REMOVED*** = tx.transaction.msg;
          if (parent_id != null || post_id != null) { forum.saveComment(tx, post_id, parent_id); ***REMOVED***
          break;
        default:
          break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  async handlePeerRequest(app, msg, peer, callback) {
    // loads list of posts
    switch(msg.request) {
      case 'forum request all':
        this.handleForumPostsResponse(app, msg, peer, callback);
        break;
      case 'forum request channel':
        break;
      case 'forum request comments':
        this.handleRequstComments(app, msg, peer, callback);
        break;
      case 'forum vote':
        this.handleForumVote(app, msg, peer, callback);
        break;
      default:
        break;
***REMOVED***
  ***REMOVED***

  async handleForumPostsResponse(app, msg, peer, callback) {
    var sql    = "SELECT * FROM posts ORDER BY unixtime_rank DESC LIMIT $ppp OFFSET $offset";
    var params = { $ppp : this.post_limiter , $offset : 0 ***REMOVED***;
    try {
      var rows = await this.db.all(sql, params);
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
    if (rows != null) {
      if (rows.length != 0) {
        let message                 = {***REMOVED***;
            message.request         = "forum response payload";
            message.data            = [];

        message.data = rows.map(row => {
          let {id, tx, subreddit, post_id, unixtime, comments, votes***REMOVED*** = row;
          tx = JSON.parse(tx)
          let {text, link, title***REMOVED*** = tx.msg;

          return {
            id: id,
            tx: tx,
            title,
            link,
            text,
            subreddit: subreddit ? subreddit : "main",
            post_id: post_id,
            unixtime: unixtime,
            comments: comments,
            votes: votes,
      ***REMOVED***;
    ***REMOVED***);

        peer.sendRequest(message.request, message.data);
  ***REMOVED***
***REMOVED*** else {
      peer.sendRequest("reddit load null", {***REMOVED***);
***REMOVED***
    return;
  ***REMOVED***

  async handleRequstComments(app, msg, peer, callback) {
    // get post id for comments
    var post_id = msg.data.post_id;
    var sql = "SELECT * FROM comments WHERE post_id = $post_id ORDER BY unixtime ASC";

    try {
      var rows = await this.db.all(sql, { $post_id : post_id ***REMOVED***);
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***

    if (rows != null) {
      var message             = {***REMOVED***;
      message.request         = "forum response comments";
      message.data            = {***REMOVED***
      message.data.post_id    = post_id;
      message.data.comments   = [];

      for (var fat = 0; fat <= rows.length - 1; fat++) {
        let {id, tx, unixtime, votes***REMOVED*** = rows[fat];
        tx = JSON.parse(tx)
        let {identifier, post_id, parent_id, subreddit, text***REMOVED*** = tx.msg;

        let comment = {
          id: id,
          text: text,
          author: identifier,
          publickey: tx.from[0].add,
          votes: votes,
          unixtime: unixtime,
          post_id: post_id,
          parent_id: parent_id.toString(),
          subreddit: subreddit,
          sig: tx.sig,
          tx
    ***REMOVED***

        if (comment.parent_id === '') {
          message.data.comments = [...message.data.comments, {
            data: comment,
            children: []
      ***REMOVED***]
          message.data.comments.sort((a,b) =>  b.data.votes - a.data.votes)
    ***REMOVED*** else {
          this.branchTraverse(message.data.comments, comment)
    ***REMOVED***
  ***REMOVED***
      peer.sendRequest(message.request, message.data);
***REMOVED***
  ***REMOVED***

  async handleForumVote(app, msg, peer, callback) {
    var vote  = msg.data.vote;
    var type  = msg.data.type;
    var docid = msg.data.id;
    var voter = peer.peer.publickey;

    try {
      var row = await this.db.all(
        `SELECT count(*) AS count FROM votes WHERE docid = $dic AND publickey = $pkey`,
        { $dic : docid , $pkey : voter ***REMOVED***
      );
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***

    if (row != null) {
      if (row.count == 1) { return; ***REMOVED***
      try {
        this.db.run(
          `INSERT OR IGNORE INTO votes (docid, publickey) VALUES ($docid, $pkey)`,
          { $docid : docid , $pkey : voter ***REMOVED***
        );
  ***REMOVED*** catch(err) {
        console.log(err);
  ***REMOVED***

      var sql3 = "";
      var params3 = { $pid : docid ***REMOVED***;

      if (type == "post") {

***REMOVED*** if we haven't voted yet, we are permitted to vote
        var current_time = new Date().getTime();
        var vote_bonus   = 1000000;

        sql3 = "UPDATE posts SET votes = votes + 1, unixtime_rank = cast((unixtime_rank + ($vote_bonus * (2000000/($current_time-unixtime)))) as INTEGER) WHERE post_id = $pid";
        params3 = { $pid : docid , $vote_bonus : vote_bonus , $current_time : current_time ***REMOVED***;

        if (vote == -1) {
          sql3 = "UPDATE posts SET votes = votes - 1, unixtime_rank = cast((unixtime_rank - ($vote_bonus * (2000000/($current_time-unixtime)))) as INTEGER) WHERE post_id = $pid";
          params3 = { $pid : docid , $vote_bonus : vote_bonus , $current_time : current_time ***REMOVED***;
    ***REMOVED***
  ***REMOVED*** else {
        sql3 = "UPDATE comments SET votes = votes + 1 WHERE comment_id = $pid";
        if (vote == -1) {
          sql3 = "UPDATE comments SET votes = votes - 1 WHERE comment_id = $pid";
    ***REMOVED***
  ***REMOVED***
      try {
        this.db.all(sql3, params3);
  ***REMOVED*** catch(err) {
        console.log(err);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  branchTraverse(branch, comment) {
    branch.forEach(node => {
      if (node.data.sig === comment.parent_id) {
        node.children.push({
          data: comment,
          children: []
    ***REMOVED***)
        node.children.sort((a,b) =>  b.data.votes - a.data.votes)
        return
  ***REMOVED***
      else if (node.children !== []) {
        this.branchTraverse(node.children, comment)
  ***REMOVED***
***REMOVED***)
  ***REMOVED***

  async savePost(tx) {
    console.log("save post");
    var myhref = tx.transaction.msg.link;
    if (myhref.indexOf("http://") != 0 && myhref.indexOf("https://") != 0) { myhref = "http://" + myhref; ***REMOVED***

    var link   = new URL(myhref);

    var sql = `
      INSERT OR IGNORE INTO
      posts (tx, votes, comments, post_id, reported, approved, subreddit, unixtime, unixtime_rank, url, domain)
      VALUES ($tx, 1, 0, $post_id, 0, 0, $subreddit, $unixtime, $unixtime_rank, $url, $domain)
    `;

    try {
      let row = await this.db.run(sql, {
        $tx: JSON.stringify(tx.transaction),
        $post_id: tx.transaction.sig,
        $subreddit: tx.transaction.msg.subreddit.toLowerCase(),
        $unixtime: tx.transaction.ts,
        $unixtime_rank: tx.transaction.ts,
        $url : link.href,
        $domain : link.hostname
  ***REMOVED***);

      if (row) { this.lastID = row.lastID; ***REMOVED***
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***

    //
    // TODO: Image module should be used to create and save snapshots, along with other things
  ***REMOVED***

  saveComment(tx, post_id, parent_id) {
    var sql = `
      INSERT OR IGNORE INTO comments (tx, votes, post_id, reported, approved, comment_id, parent_id, unixtime)
      VALUES ($tx, 1, $post_id, 0, 0, $comment_id, $parent_id, $unixtime)
    `;

    try {
      this.db.run(sql, {
        $tx: JSON.stringify(tx.transaction),
        $post_id: post_id,
        $comment_id: tx.transaction.sig,
        $parent_id: parent_id,
        $unixtime: tx.transaction.ts
  ***REMOVED***);
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***

    try {
      this.db.run(
        `UPDATE posts SET comments = comments + 1 WHERE post_id = $pid`,
        { $pid : post_id ***REMOVED***
      );
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***

  shouldAffixCallbackToModule(modname) {
    if (modname == "Forum") { return 1; ***REMOVED***
  ***REMOVED***
***REMOVED***

module.exports = ForumCore;