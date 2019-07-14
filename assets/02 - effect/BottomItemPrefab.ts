const { ccclass, property } = cc._decorator;

@ccclass
export default class BottomItemPrefab extends cc.Component {
    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Sprite)
    picSprite: cc.Sprite = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    onLoad() {
        this.node.opacity = 0;
    }

    bindData(index: number) {
        this.descLabel.string = index + "";
        this.picSprite.node.color = cc.color(255, 255, 255 * ((index % 50) / 50), 255);
    }

    /**
     * 本Item进入ScrollView的时候回调
     */
    onEnterSrcollView() {
        this.node.opacity = 255;
    }

    /**
     * 本Item离开ScrollView的时候回调
     */
    onExitScrollView() {
        this.node.opacity = 0;
    }

    /**
     * Item 进入 ScrollView 后，位置发生移动时回调，离开ScrollView后不会回调
     *
     * @param xOffsetPercent 相对于 ScrollView 可视区域中心点，X的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最左边，1：为可视区域最右边
     * @param yOffsetPercent 相对于 ScrollView 可视区域中心点，Y的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最下边，1：为可视区域最上边
     */
    onPositionChange(xOffsetPercent: number, yOffsetPercent: number) {
        this.contentNode.scale = 0.3 + 1.5 * (0.5 - Math.abs(xOffsetPercent - 0.5));
    }
}
