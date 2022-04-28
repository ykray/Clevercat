"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchScope = exports.VoteType = exports.AuthorType = void 0;
var AuthorType;
(function (AuthorType) {
    AuthorType[AuthorType["Asker"] = 0] = "Asker";
    AuthorType[AuthorType["Answerer"] = 1] = "Answerer";
})(AuthorType = exports.AuthorType || (exports.AuthorType = {}));
var VoteType;
(function (VoteType) {
    VoteType[VoteType["Upvote"] = 1] = "Upvote";
    VoteType[VoteType["Downvote"] = -1] = "Downvote";
})(VoteType = exports.VoteType || (exports.VoteType = {}));
var SearchScope;
(function (SearchScope) {
    SearchScope["Questions"] = "questions";
    SearchScope["Answers"] = "answers";
    SearchScope["Full"] = "full";
})(SearchScope = exports.SearchScope || (exports.SearchScope = {}));
//# sourceMappingURL=Types.js.map