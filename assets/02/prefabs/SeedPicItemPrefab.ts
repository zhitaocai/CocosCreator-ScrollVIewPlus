import { ResourcesLoader } from "../scripts/utils/ResourcesLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SeedPicItemPrefab extends cc.Component {
	@property(cc.Sprite)
	picSprite: cc.Sprite = null;

	@property(cc.Label)
	descLabel: cc.Label = null;

	@property(cc.Node)
	placeHolderContentNode: cc.Node = null;

	@property(cc.Node)
	placeHolderLoadingNode: cc.Node = null;

	private _picPath: string = null;

	/**
	 * 绑定数据
	 *
	 * @param picPath 图片地址
	 */
	bindData(picPath: string) {
		this._picPath = picPath;
	}

	/**
	 * 本Item进入ScrollView的时候回调
	 */
	onEnterSrcollView() {
		// 显示Item节点
		this.node.opacity = 255;

		// 加载并显示图片
		this._loadAndShowPic();
	}

	/**
	 * 本Item离开ScrollView的时候回调
	 */
	onExitScrollView() {
		this.node.opacity = 0;
	}

	/**
	 * 加载并展示图片
	 */
	private async _loadAndShowPic() {
		this._showPlaceHolder();
		this.picSprite.spriteFrame = await ResourcesLoader.loadSpriteFrameFromResources(this._picPath);
		this.descLabel.string = this._picPath;
		this._hidePlaceHolder();
	}

	private _showPlaceHolder() {
		this.placeHolderContentNode.active = true;
		this.placeHolderContentNode.stopAllActions();
		this.placeHolderContentNode.opacity = 255;

		this.placeHolderLoadingNode.stopAllActions();
		this.placeHolderLoadingNode.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
	}

	private _hidePlaceHolder() {
		this.placeHolderContentNode.stopAllActions();
		this.placeHolderContentNode.runAction(
			cc.sequence(
				cc.fadeOut(0.24),
				cc.callFunc(() => {
					this.placeHolderContentNode.active = false;
					this.placeHolderLoadingNode.stopAllActions();
				}, this)
			)
		);
	}
}
