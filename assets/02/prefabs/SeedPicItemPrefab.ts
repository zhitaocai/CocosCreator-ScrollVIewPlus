import { ResourcesLoader } from "../scripts/utils/ResourcesLoader";

const { ccclass, property } = cc._decorator;

export type SeedPicItemData = {
	/**
	 * Item下标
	 */
	index: number;

	/**
	 * Item所加载的图片
	 */
	picPath: string;
};

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

	private _data: SeedPicItemData = null;

	onLoad() {
		this.node.opacity = 0;
	}

	/**
	 * 绑定数据
	 */
	bindData(data: SeedPicItemData) {
		this._data = data;
	}

	/**
	 * 本Item进入ScrollView的时候回调
	 */
	onEnterSrcollView() {
		this._show();
		// 加载并显示图片
		this._loadAndShowPic();
	}

	/**
	 * 本Item离开ScrollView的时候回调
	 */
	onExitScrollView() {
		this._hide();
	}

	/**
	 * 加载并展示图片
	 */
	private async _loadAndShowPic() {
		this._showPlaceHolder();

		// 模拟延迟一段时间后再加载成功
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
				// }, Math.random() * 1000);
			}, 160);
		});
		this.picSprite.spriteFrame = await ResourcesLoader.loadSpriteFrameFromResources(this._data.picPath);
		this.descLabel.string = `${this._data.index}: ${this._data.picPath}`;
		this._hidePlaceHolder();
	}

	private _show() {
		this.node.opacity = 255;
		this.node.stopAllActions();
		this.node.scale = 0.1;
		this.node.runAction(cc.scaleTo(0.08, 1).easing(cc.easeSineOut()));
	}

	private _hide() {
		this.node.opacity = 0;
		this.node.stopAllActions();
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
