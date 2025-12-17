/**
 * Convert various video platform URLs to embeddable format
 */

// Extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/live\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract Twitch channel or video from URL
const getTwitchId = (url) => {
  const channelMatch = url.match(/twitch\.tv\/([^\/\n?#]+)/);
  const videoMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
  
  if (videoMatch) {
    return { type: 'video', id: videoMatch[1] };
  }
  if (channelMatch) {
    return { type: 'channel', id: channelMatch[1] };
  }
  return null;
};

// Convert URL to embed URL
const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  }

  // Twitch
  const twitchData = getTwitchId(url);
  if (twitchData) {
    if (twitchData.type === 'video') {
      return `https://player.twitch.tv/?video=${twitchData.id}&parent=${process.env.CLIENT_DOMAIN || 'localhost'}`;
    }
    return `https://player.twitch.tv/?channel=${twitchData.id}&parent=${process.env.CLIENT_DOMAIN || 'localhost'}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // If already an embed URL or unknown format, return as-is
  return url;
};

// Validate if URL is a supported streaming platform
const isValidStreamUrl = (url) => {
  if (!url) return false;
  
  const supportedPlatforms = [
    /youtube\.com/,
    /youtu\.be/,
    /twitch\.tv/,
    /vimeo\.com/
  ];

  return supportedPlatforms.some(pattern => pattern.test(url));
};

module.exports = {
  getYouTubeVideoId,
  getTwitchId,
  getEmbedUrl,
  isValidStreamUrl
};
