const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingDialogCtrl extends cc.Component {
	@property({
		type: cc.Node,
		tooltip: "对话框背景"
	})
	dialogBg: cc.Node = null;

	@property({
		type: cc.Node,
		tooltip: "旋转 Sprite 所在节点"
	})
	loadingSpriteNode: cc.Node = null;

	show() {
		this.node.active = true;

		// 背景从透明变半透明
		this.dialogBg.stopAllActions();
		this.dialogBg.opacity = 0;
		this.dialogBg.runAction(cc.fadeTo(0.24, 180));

		// 一直旋转
		this.loadingSpriteNode.stopAllActions();
		this.loadingSpriteNode.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
	}

	hide() {
		// 背景从半透明变透明，之后隐藏节点
		this.dialogBg.stopAllActions();
		this.dialogBg.runAction(
			cc.sequence(
				cc.fadeTo(0.24, 0),
				cc.callFunc(() => {
					this.node.active = false;
				})
			)
		);

		// 停止旋转
		this.loadingSpriteNode.stopAllActions();
	}
}
