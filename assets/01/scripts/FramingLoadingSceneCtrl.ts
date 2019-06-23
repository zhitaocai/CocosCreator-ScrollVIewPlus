import LoadingDialogCtrl from "./LoadingDialogCtrl";
import ScrollViewCtrl from "./ScrollViewCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FramingLoadingSceneCtrl extends cc.Component {
	@property(LoadingDialogCtrl)
	loadingDialogCtrl: LoadingDialogCtrl = null;

	@property(ScrollViewCtrl)
	scrollViewCtrl: ScrollViewCtrl = null;

	@property({
		type: cc.EditBox,

		tooltip: "输入需要创建的节点数量"
	})
	childNodeCountEditBox: cc.EditBox = null;

	async onDirectLoadBtnClick() {
		this.loadingDialogCtrl.show();
		await this.scrollViewCtrl.directLoad(Number.parseInt(this.childNodeCountEditBox.string));
		this.loadingDialogCtrl.hide();
	}

	async onFramingLoadBtnClick() {
		this.loadingDialogCtrl.show();
		await this.scrollViewCtrl.framingLoad(Number.parseInt(this.childNodeCountEditBox.string));
		this.loadingDialogCtrl.hide();
	}
}
