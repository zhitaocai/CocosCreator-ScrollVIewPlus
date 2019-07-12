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
}
