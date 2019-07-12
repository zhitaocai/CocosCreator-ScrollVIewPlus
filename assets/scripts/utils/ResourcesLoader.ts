export class ResourcesLoader {
	/**
	 * 加载 Resources 中图片地址
	 *
	 * @param spriteFrameUrl Resources 中图片地址
	 */
	static loadSpriteFrameFromResources(spriteFrameUrl: string) {
		return new Promise<cc.SpriteFrame>((resolve, reject) => {
			cc.loader.loadRes(spriteFrameUrl, cc.SpriteFrame, (error: Error, spriteFrame) => {
				if (error != null) {
					if (CC_DEBUG) {
						cc.error(`load (${spriteFrameUrl}) failed!`);
						cc.error(error);
					}
					reject(error);
					return;
				}
				resolve(spriteFrame);
			});
		});
	}
}
