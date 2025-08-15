import React from "react";

const Instructions = () => {
  return (
    <div className="instructions-bg-wrapper">
      <div className="instructions-page container no-top-pad">
        <div className="header-bg">
          <h1 className="faqs-name">How to Set Wallpaper</h1>
        </div>

        <div className="steps-cards-container">
          {/* WINDOWS SETUP */}
          <div className="steps-card">
            <div className="question">Windows Setup</div>
            <ul className="steps-info">
              <li><strong>1. Download</strong> the wallpaper file (.jpg for static, .mp4 for live).</li>
              <li>
                <strong>Static Wallpapers:</strong>
                <div className="sub-steps-overlay">
                  <div className="sub-steps">
                    <p><strong>2. Right-click</strong> on your desktop and select "Personalize".</p>
                    <p><strong>3. Click</strong> "Background" and select "Picture".</p>
                    <p><strong>4. Upload</strong> the .jpg image and apply it.</p>
                  </div>
                </div>
              </li>
              <li>
                <strong>Live Wallpapers:</strong>
                <div className="sub-steps-overlay">
                  <div className="sub-steps">
                    <p><strong>1. Download</strong> Lively Wallpaper from <a href="https://rocksdanister.github.io/lively" target="_blank" rel="noopener noreferrer">rocksdanister.github.io/lively</a>.</p>
                    <p><strong>2. Install</strong> and open the app.</p>
                    <p><strong>3. Import</strong> your .mp4 file and set it as wallpaper.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* MACOS SETUP */}
          <div className="steps-card">
            <div className="question">macOS Setup (M1/M2/M3 Recommended)</div>
            <ul className="steps-info">
              <li><strong>1. Download</strong> the wallpaper file (.jpg or .mp4).</li>
              <li>
                <strong>Static Wallpapers:</strong>
                <div className="sub-steps-overlay">
                  <div className="sub-steps">
                    <p><strong>2. Open</strong> "System Settings" → "Wallpaper".</p>
                    <p><strong>3. Drag</strong> the .jpg into the wallpaper section or click “Add Folder”.</p>
                    <p><strong>4. Set</strong> it as your desktop background.</p>
                  </div>
                </div>
              </li>
              <li>
                <strong>Live Wallpapers:</strong>
                <div className="sub-steps-overlay">
                  <div className="sub-steps">
                    <p>⚠️ <strong>Note:</strong> macOS does not support live wallpapers natively.</p>

                    <p><strong>Option 1: <a href="https://apps.apple.com/us/app/plash/id1494023533" target="_blank" rel="noopener noreferrer">Plash</a></strong> (free) lets you play .mp4 videos or web-based loops as your desktop wallpaper.</p>
                    <p><strong>1. Install</strong> Plash from the Mac App Store.</p>
                    <p><strong>2. Add</strong> the video URL or local HTML page pointing to your .mp4 file.</p>
                    <p><strong>3. Set</strong> it as your dynamic desktop background.</p>

                    <p><strong>Option 2: <a href="https://wallper.app/" target="_blank" rel="noopener noreferrer">Wallper.app</a></strong> ($9.99 one-time purchase) offers a smoother and dedicated experience for live wallpapers on Mac (M1/M2/M3).</p>
                    <p><strong>1. Purchase and download</strong> Wallper.app from their website.</p>
                    <p><strong>2. Launch</strong> the app and create an account if needed.</p>
                    <p><strong>3. Import</strong> your .mp4 wallpaper file through the “Upload” or “My Media” section.</p>
                    <p><strong>4. Set</strong> it as your live wallpaper from the library interface.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* ANDROID SETUP */}
          <div className="steps-card">
            <div className="question">Android Setup</div>
            <ul className="steps-info">
              <li><strong>1. Save</strong> the image or video file to your device.</li>
              <li>
                <strong>Static Wallpapers:</strong>
                <div className="sub-steps-overlay">
                  <div className="sub-steps">
                    <p><strong>2. Open</strong> the image in your Gallery app.</p>
                    <p><strong>3. Tap</strong> menu → "Set as wallpaper".</p>
                  </div>
                </div>
              </li>
              <li>
                <strong>Live Wallpapers:</strong>
                <div className="sub-steps-overlay">
                  <div className="sub-steps">
                    <p><strong>1. Download</strong> "Video Live Wallpaper" from Google Play.</p>
                    <p><strong>2. Open</strong> the app and select your .mp4 file.</p>
                    <p><strong>3. Apply</strong> it as your live background.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;