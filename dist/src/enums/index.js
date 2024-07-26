"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPostStatus = exports.EUserStatus = exports.EHttpMethod = void 0;
var EHttpMethod;
(function (EHttpMethod) {
    EHttpMethod["GET"] = "GET";
    EHttpMethod["POST"] = "POST";
    EHttpMethod["PUT"] = "PUT";
    EHttpMethod["DELETE"] = "DELETE";
})(EHttpMethod || (exports.EHttpMethod = EHttpMethod = {}));
var EUserStatus;
(function (EUserStatus) {
    EUserStatus["active"] = "active";
    EUserStatus["inactive"] = "inactive";
    EUserStatus["deactivated"] = "deactivated";
    EUserStatus["suspended"] = "suspended";
    EUserStatus["blocked"] = "blocked";
    EUserStatus["deleted"] = "deleted";
    EUserStatus["banned"] = "banned";
    EUserStatus["reported"] = "reported";
    EUserStatus["pending"] = "pending";
    EUserStatus["withheld"] = "withheld";
    EUserStatus["restricted"] = "restricted";
})(EUserStatus || (exports.EUserStatus = EUserStatus = {}));
var EPostStatus;
(function (EPostStatus) {
    EPostStatus["active"] = "active";
    EPostStatus["inactive"] = "inactive";
    EPostStatus["deactivated"] = "deactivated";
    EPostStatus["suspended"] = "suspended";
    EPostStatus["blocked"] = "blocked";
    EPostStatus["deleted"] = "deleted";
    EPostStatus["banned"] = "banned";
    EPostStatus["reported"] = "reported";
    EPostStatus["pending"] = "pending";
    EPostStatus["withheld"] = "withheld";
    EPostStatus["restricted"] = "restricted";
})(EPostStatus || (exports.EPostStatus = EPostStatus = {}));
//# sourceMappingURL=index.js.map