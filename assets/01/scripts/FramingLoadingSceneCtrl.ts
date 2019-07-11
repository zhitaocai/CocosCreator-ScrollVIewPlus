import ScrollViewCtrl from "./ScrollViewCtrl";
import LoadingDialog from "../../prefabs/LoadingDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FramingLoadingSceneCtrl extends cc.Component {
	@property(LoadingDialog)
	loadingDialog: LoadingDialog = null;

	@property(ScrollViewCtrl)
	scrollViewCtrl: ScrollViewCtrl = null;

	@property({
		type: cc.EditBox,
		tooltip: "输入需要创建的节点数量"
	})
	childNodeCountEditBox: cc.EditBox = null;

	onLoad() {
		this.loadingDialog.hide();
	}

	async onDirectLoadBtnClick() {
		this.loadingDialog.show();
		await this.scrollViewCtrl.directLoad(Number.parseInt(this.childNodeCountEditBox.string));
		this.loadingDialog.hide();
	}

	async onFramingLoadBtnClick() {
		this.loadingDialog.show();
		await this.scrollViewCtrl.framingLoad(Number.parseInt(this.childNodeCountEditBox.string));
		this.loadingDialog.hide();
	}
}
