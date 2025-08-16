declare module "exif-js" {
  // 為 exif-js 提供一個基本的型別定義，以解決專案中的型別問題。
  // 這可以讓 TypeScript 理解 EXIF.getData 等函式的簽名。

  // 定義 EXIF 標籤的通用結構
  interface ExifTags {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  // 定義被 exif-js 處理過的圖片/檔案物件
  // 它擴充了 File 型別，並加上了 exifdata 屬性
  interface ExifImage extends File {
    exifdata: ExifTags;
  }

  // 宣告函式簽名
  function getData(
    img: File | HTMLImageElement,
    callback: (this: ExifImage) => void
  ): void;
  function getAllTags(img: ExifImage | { exifdata: ExifTags }): ExifTags;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getTag(img: ExifImage | { exifdata: ExifTags }, tag: string): any;

  // 建立一個符合 exif-js 匯出結構的物件
  const EXIF: {
    getData: typeof getData;
    getAllTags: typeof getAllTags;
    getTag: typeof getTag;
  };

  export default EXIF;
}
