var Popup = require('Popup');
var NetworkManager = require('NetworkManager');
cc.Class({
    extends: Popup,

    properties: {
        scrollView: cc.ScrollView,
        avatarPrefab: cc.Prefab,
        avatarId: 0
    },

    onLoad : function () {
        var self = this;
        this.content = this.scrollView.content;
        var innerSize = cc.size(this.content.getContentSize().width,
            this.content.getContentSize().height);
        var padding = 0;
        for (var i = 0; i < 22; ++i) {
            var item = cc.instantiate(this.avatarPrefab);
            item.setTag(i + 100000);
            item.getComponent('AvatarItem').init(i, Common.getAvatarId(), function(index){
                self.setAvatarId(index);
            });

            var size = item.getComponent('AvatarItem').node.getContentSize();
            if(i == 0){
                padding = innerSize.width/3 - size.width;
                innerSize = cc.size(innerSize.width,size.height*1.1*8);
                this.content.setContentSize(innerSize);
            }

            var x = parseInt(i%3);
            var y = parseInt(i/3);

            var posX = (x - 1)*size.width;
            var posY = (-0.5 - y)*size.height*1.1;

            item.setPositionX(posX);
            item.setPositionY(posY);
            this.content.addChild(item);
        }

    },

    setAvatarId: function (index) {
        cc.log("index =", index);
        this.content = this.scrollView.content;

        for (var i = 0; i < this.content.children.length; i++){
            if(i !== index){
                var item = this.content.children[i].getComponent('AvatarItem');
                item.visibleDark();
                // item.node.setLocalZOrder(1);
                // item.node.setScale(1,1);
            }
        }
        this.avatarId = 100000 + index;
    },

    changeAvatar: function () {
        Common.setAvatarId(this.avatarId);

        var edit_info = new proto.BINEditingInfo();

        edit_info.setInfofield(Config.Update.UPDATE_AVATAR);
        edit_info.setNewvalue(this.avatarId.toString());
        NetworkManager.getUpdateUserInfoMessageFromServer(edit_info, 1);
        this.disappear();
    }
});
