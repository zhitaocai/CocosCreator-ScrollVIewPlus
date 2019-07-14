import ScrollViewPlus from "../02/scripts/ScrollViewPlus";
import LoadingDialog from "../prefabs/LoadingDialog";
import GalleryItemPrefab from "./GalleryItemPrefab";
import LeftItemPrefab from "./LeftItemPrefab";
import BottomItemPrefab from "./BottomItemPrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewEffectRender extends cc.Component {
    @property(ScrollViewPlus)
    leftSv: ScrollViewPlus = null;

    @property(cc.Prefab)
    leftSvItemPrefab: cc.Prefab = null;

    @property(ScrollViewPlus)
    bottomSv: ScrollViewPlus = null;

    @property(cc.Prefab)
    bottomSvItemPrefab: cc.Prefab = null;

    @property(ScrollViewPlus)
    gallerySv: ScrollViewPlus = null;

    @property(cc.Prefab)
    gallerySvItemPrefab: cc.Prefab = null;

    @property(LoadingDialog)
    loadingDialog: LoadingDialog = null;

    async start() {
        this.loadingDialog.show();

        await this.executePreFrame(this._getLeftGenerator(50), 1);
        this.leftSv.optDc();

        await this.executePreFrame(this._getBottomGenerator(50), 1);
        this.bottomSv.optDc();

        await this.executePreFrame(this._getGalleryItemGenerator(50), 1);
        this.gallerySv.optDc();

        this.loadingDialog.hide();
    }

    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms），每次执行 Generator 的操作时，最长可持续执行时长。假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
     */
    private executePreFrame(generator: Generator, duration: number) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间
                let startTime = new Date().getTime();

                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {
                    // 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }

                    // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };

            // 运行执行函数
            execute();
        });
    }
    private *_getBottomGenerator(length: number) {
        for (let i = 0; i < length; i++) {
            yield this._initBottomItemPrefab(i);
        }
    }
    private _initBottomItemPrefab(index: number) {
        let itemNode = cc.instantiate(this.bottomSvItemPrefab);
        itemNode.parent = this.bottomSv.content;
        itemNode.getComponent(BottomItemPrefab).bindData(index);
    }

    private *_getLeftGenerator(length: number) {
        for (let i = 0; i < length; i++) {
            yield this._initLeftItemPrefab(i);
        }
    }
    private _initLeftItemPrefab(index: number) {
        let itemNode = cc.instantiate(this.leftSvItemPrefab);
        itemNode.parent = this.leftSv.content;
        itemNode.getComponent(LeftItemPrefab).bindData(index);
    }

    private *_getGalleryItemGenerator(length: number) {
        for (let i = 0; i < length; i++) {
            yield this._initGalleryItemPrefab(
                `seed/${i % 12}` // 因为我这里就只有12张图片，所以就用 % 循环了
            );
        }
    }
    private _initGalleryItemPrefab(picPath: string) {
        let itemNode = cc.instantiate(this.gallerySvItemPrefab);
        itemNode.parent = this.gallerySv.content;
        itemNode.getComponent(GalleryItemPrefab).bindData(picPath);
    }
}
