// src/app/page.tsx
"use client"; // 因為有互動，需要宣告為客戶端元件

import { useState } from "react";
import dynamic from "next/dynamic";
import exifr from "exifr";
import {
  UploadCloud,
  Camera,
  Aperture,
  Clock,
  Gauge,
  Focus,
  MapPin,
  Copyright,
  Wrench,
  RotateCw,
} from "lucide-react";

// 擴充 EXIF 資料的型別，以包含更多資訊
interface ExifData {
  Make?: string;
  Model?: string;
  LensModel?: string;
  DateTimeOriginal?: string;
  FNumber?: number;
  ExposureTime?: number;
  ISOSpeedRatings?: number;
  FocalLength?: number;
  latitude?: number;
  longitude?: number;
  Software?: string;
  Copyright?: string;
  Orientation?: string;
}

const MapDisplay = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setExifData(null);
    setImagePreview(URL.createObjectURL(file)); // 使用 Object URL 提高效率

    try {
      // 啟用 iptc 和 xmp 以獲取更豐富的資訊
      const data = await exifr.parse(file, { iptc: true, xmp: true });
      if (!data) {
        setError("無法解析 EXIF 資訊。");
        setIsLoading(false);
        return;
      }

      const extractedData: ExifData = {
        Make: data.Make,
        Model: data.Model,
        LensModel: data.LensModel,
        DateTimeOriginal: data.DateTimeOriginal?.toLocaleString(),
        FNumber: data.FNumber,
        ExposureTime: data.ExposureTime,
        ISOSpeedRatings: data.ISOSpeedRatings,
        FocalLength: data.FocalLength,
        latitude: data.latitude,
        longitude: data.longitude,
        Software: data.Software,
        Copyright: data.Copyright,
        Orientation: data.Orientation,
      };

      setExifData(extractedData);
    } catch (err) {
      setError("讀取 EXIF 資訊時發生錯誤。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 格式化快門速度
  const formatExposureTime = (time?: number) => {
    if (!time) return "N/A";
    if (time < 1) {
      return `1/${Math.round(1 / time)}`;
    }
    return `${time}`;
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "var(--color-background-secondary)" }}
    >
      <div
        className="w-full max-w-4xl mx-auto p-6 rounded-2xl shadow-lg"
        style={{
          backgroundColor: "var(--color-background-primary)",
          borderColor: "var(--color-border)",
          borderWidth: "1px",
        }}
      >
        <header className="text-center mb-6">
          <h1
            className="text-4xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            🌸 EXIF Viewer 🌸
          </h1>
          <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
            A base EXIF viewer
          </p>
        </header>

        {/* --- 檔案上傳區 --- */}
        <div
          className="relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-pink-300 transition-colors"
          style={{ borderColor: "var(--color-border)" }}
        >
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="flex flex-col items-center"
            style={{ color: "var(--color-text-placeholder)" }}
          >
            <UploadCloud
              size={48}
              className="mb-4"
              style={{ color: "var(--color-accent)" }}
            />
            <span className="font-semibold">點擊或拖曳圖片到這裡</span>
            <p className="text-sm">支援 JPG, PNG 格式</p>
          </div>
        </div>

        {isLoading && (
          <p
            className="text-center mt-4"
            style={{ color: "var(--color-accent)" }}
          >
            讀取中...
          </p>
        )}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}

        {/* --- 結果顯示區 --- */}
        {imagePreview && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 圖片預覽 */}
            <div>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: "var(--color-text-primary)" }}
              >
                圖片預覽
              </h2>
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg shadow-md w-full max-h-[400px] object-contain"
              />
            </div>

            {/* EXIF 資訊 */}
            <div>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: "var(--color-text-primary)" }}
              >
                EXIF 資訊
              </h2>
              <div
                className="space-y-3 p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--color-background-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <ExifInfoItem
                  icon={<Camera size={20} />}
                  label="相機型號"
                  value={`${exifData?.Make || ""} ${exifData?.Model || "N/A"}`}
                />
                <ExifInfoItem
                  icon={<Aperture size={20} />}
                  label="光圈"
                  value={exifData?.FNumber ? `f/${exifData.FNumber}` : "N/A"}
                />
                <ExifInfoItem
                  icon={<Clock size={20} />}
                  label="快門"
                  value={`${formatExposureTime(exifData?.ExposureTime)} s`}
                />
                <ExifInfoItem
                  icon={<Gauge size={20} />}
                  label="ISO"
                  value={exifData?.ISOSpeedRatings || "N/A"}
                />
                <ExifInfoItem
                  icon={<i className="w-5 h-5 text-center font-mono">ƒ</i>}
                  label="焦距"
                  value={
                    exifData?.FocalLength ? `${exifData.FocalLength} mm` : "N/A"
                  }
                />
                <ExifInfoItem
                  icon={<i className="w-5 h-5 text-center font-mono">📅</i>}
                  label="拍攝時間"
                  value={exifData?.DateTimeOriginal || "N/A"}
                />
                <ExifInfoItem
                  icon={<Focus size={20} />}
                  label="鏡頭型號"
                  value={exifData?.LensModel || "N/A"}
                />
                {exifData?.latitude && exifData?.longitude && (
                  <ExifInfoItem
                    icon={<MapPin size={20} />}
                    label="GPS"
                    value={`${exifData.latitude.toFixed(
                      4
                    )}, ${exifData.longitude.toFixed(4)}`}
                  />
                )}
                <ExifInfoItem
                  icon={<Wrench size={20} />}
                  label="處理軟體"
                  value={exifData?.Software || "N/A"}
                />
                <ExifInfoItem
                  icon={<Copyright size={20} />}
                  label="版權資訊"
                  value={exifData?.Copyright || "N/A"}
                />
                <ExifInfoItem
                  icon={<RotateCw size={20} />}
                  label="照片方向"
                  value={exifData?.Orientation || "N/A"}
                />
              </div>
            </div>
          </div>
        )}

        {exifData?.latitude && exifData?.longitude && (
          <div className="mt-8">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              拍攝地點
            </h2>
            <div
              className="h-96 w-full rounded-lg overflow-hidden shadow-md"
              style={{
                border: "1px solid var(--color-border)",
              }}
            >
              <MapDisplay
                lat={exifData.latitude}
                lng={exifData.longitude}
                model={exifData.Model}
              />
            </div>
          </div>
        )}
      </div>
      <footer
        className="text-center mt-8 text-sm"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        2025 © Nothing happen.
      </footer>
    </main>
  );
}

// 為了讓 UI 更整潔，建立一個小元件來顯示每一條 EXIF 資訊
const ExifInfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div
    className="flex items-center justify-between p-2 rounded"
    style={{ backgroundColor: "var(--color-background-primary)" }}
  >
    <div className="flex items-center gap-3">
      <span style={{ color: "var(--color-accent)" }}>{icon}</span>
      <span
        className="font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
    </div>
    <span
      className="font-mono text-right"
      style={{ color: "var(--color-text-primary)" }}
    >
      {value}
    </span>
  </div>
);
