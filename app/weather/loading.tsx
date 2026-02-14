/**
 * 天气页面加载状态
 */

export default function WeatherLoading() {
  return (
    <div className="weather-loading-container">
      <div className="weather-loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">正在加载天气数据...</p>
        <p className="loading-subtext">Initializing Weather System</p>
      </div>
    </div>
  );
}