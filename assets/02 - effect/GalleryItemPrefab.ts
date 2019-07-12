import { ResourcesLoader } from "../scripts/utils/ResourcesLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GalleryItemPrefab extends cc.Component {
    @property(cc.Sprite)
    picSprite: cc.Sprite = null;

    private _picPath: string = null;

    onLoad() {
        this.node.opacity = 0;
    }

    bindData(picPath: string) {
        this._picPath = picPath;
    }

    /**
     * 本Item进入ScrollView的时候回调
     */
    onEnterSrcollView() {
        this.node.opacity = 255;
        ResourcesLoader.loadSpriteFrameFromResources(this._picPath).then((spriteFrame: cc.SpriteFrame) => {
            this.picSprite.spriteFrame = spriteFrame;
        });
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
        // this.node.scale = 0.2 + (0.8 * Math.abs(0.5 - xOffsetPercent)) / 0.5;

        let x = 0.5 - xOffsetPercent;
        let y = 0.5 - yOffsetPercent;
        let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        let maxDistance = Math.sqrt(0.5);
        this.node.scale = distance / maxDistance;
    }
}
