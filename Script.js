// script.js - Professional AI Video Platform

// Configuration
const API_CONFIG = {
    // You'll need to sign up for these APIs
    // stability: 'https://api.stability.ai/v2beta/image-to-video',
    // fal: 'https://fal.run/fal-ai/veo3',
    mockMode: true // Use mock mode for demo
};

// State management
let currentVideoBlob = null;
let generationInProgress = false;

// Main generate function
async function generateVideo() {
    if (generationInProgress) return;
    
    const prompt = document.getElementById('promptInput').value;
    if (!prompt.trim()) {
        alert('Fadlan ku qor sheeko!');
        return;
    }
    
    // Show loading
    generationInProgress = true;
    document.getElementById('loadingSpinner').style.display = 'inline-block';
    document.querySelector('.generate-btn span').textContent = 'Generating...';
    
    // Get all settings (like Pika)
    const settings = {
        prompt: prompt,
        style: document.getElementById('styleSelect').value,
        duration: document.getElementById('durationSelect').value,
        aspectRatio: document.getElementById('aspectSelect').value,
        motion: document.getElementById('motionSelect').value,
        negativePrompt: document.getElementById('negativePrompt').value,
        seed: document.getElementById('seedInput').value,
        fps: document.getElementById('fpsSelect').value
    };
    
    try {
        // Try real API first, fallback to mock
        let videoUrl;
        
        if (!API_CONFIG.mockMode) {
            // Real API call (you'll need API keys)
            videoUrl = await callRealAPI(settings);
        } else {
            // Mock generation for demo
            videoUrl = await mockVideoGeneration(settings);
        }
        
        // Display the video
        displayGeneratedVideo(videoUrl, settings);
        
        // Add to trending (like Pika Explore)
        addToTrending(videoUrl, settings);
        
    } catch (error) {
        console.error('Generation failed:', error);
        alert('Generation failed. Using fallback animation...');
        
        // Fallback to canvas animation
        createFallbackAnimation(settings);
    } finally {
        // Hide loading
        generationInProgress = false;
        document.getElementById('loadingSpinner').style.display = 'none';
        document.querySelector('.generate-btn span').textContent = '✨ Generate Anime Video';
    }
}

// Mock video generation (for demo)
function mockVideoGeneration(settings) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Create a data URL for demo
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            const ctx = canvas.getContext('2d');
            
            // Draw anime-style frame
            drawAnimeFrame(ctx, 0, settings);
            
            // Convert to video (simulated)
            const videoUrl = canvas.toDataURL('image/png');
            resolve(videoUrl);
        }, 3000); // Simulate 3 second generation
    });
}

// Draw anime frame (your original function enhanced)
function drawAnimeFrame(ctx, frameNum, settings) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    
    // Background based on style
    const styles = {
        'anime-classic': { bg: '#87CEEB', sun: '#f1c40f' },
        'anime-modern': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', sun: '#ff6b6b' },
        'anime-cyberpunk': { bg: '#0f0f1f', sun: '#ff00ff' },
        'anime-studio-ghibli': { bg: '#98d8c8', sun: '#f7d794' },
        'anime-chibi': { bg: '#ffb6c1', sun: '#ff69b4' }
    };
    
    const style = styles[settings.style] || styles['anime-modern'];
    
    // Apply background
    if (style.bg.startsWith('linear-gradient')) {
        ctx.fillStyle = style.bg;
        ctx.fillRect(0, 0, w, h);
    } else {
        ctx.fillStyle = style.bg;
        ctx.fillRect(0, 0, w, h);
    }
    
    // Draw scene based on motion
    const offsetX = frameNum * 5; // Simple motion effect
    
    // Sun/Moon
    ctx.beginPath();
    ctx.arc(100 + offsetX, 80, 50, 0, Math.PI * 2);
    ctx.fillStyle = style.sun;
    ctx.fill();
    
    // Anime character
    // Head
    ctx.beginPath();
    ctx.arc(400, 300, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#fde3a7';
    ctx.fill();
    
    // Eyes (animated)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(370, 280, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(430, 280, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair based on style
    ctx.fillStyle = settings.style.includes('cyberpunk') ? '#00ffff' : '#2c3e50';
    ctx.fillRect(350, 200, 100, 60);
    
    // Text prompt
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 10;
    ctx.fillText(settings.prompt.substring(0, 30) + '...', 50, 500);
    
    // Style badge
    ctx.shadowBlur = 0;
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`✨ ${settings.style} | ${settings.motion}`, 50, 550);
}

// Display generated video
function displayGeneratedVideo(videoUrl, settings) {
    const previewPanel = document.getElementById('previewPanel');
    const video = document.getElementById('generatedVideo');
    
    // If it's a data URL (image), we need to create a video from frames
    if (videoUrl.startsWith('data:image')) {
        // For demo, just show the image in a video-like container
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        // Create animation loop
        let frame = 0;
        const animate = () => {
            drawAnimeFrame(ctx, frame++, settings);
            video.src = canvas.toDataURL('image/png');
            requestAnimationFrame(animate);
        };
        animate();
    } else {
        video.src = videoUrl;
    }
    
    // Update info
    document.getElementById('videoDuration').textContent = settings.duration + ' seconds';
    document.getElementById('videoStyle').textContent = settings.style;
    document.getElementById('videoRes').textContent = '1280x720';
    
    // Show panel
    previewPanel.style.display = 'block';
    
    // Scroll to preview
    previewPanel.scrollIntoView({ behavior: 'smooth' });
}

// Add to trending (Explore tab like Pika)
function addToTrending(videoUrl, settings) {
    const trendingGrid = document.getElementById('trendingGrid');
    
    const item = document.createElement('div');
    item.className = 'trending-item';
    
    // Create thumbnail
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 225;
    const ctx = canvas.getContext('2d');
    drawAnimeFrame(ctx, 0, settings);
    
    item.innerHTML = `
        <img src="${canvas.toDataURL('image/png')}" alt="Trending" style="width:100%; aspect-ratio:16/9; object-fit:cover;">
        <div class="trending-info">
            <strong>${settings.prompt.substring(0, 30)}...</strong>
            <p>✨ ${settings.style} • ⏱️ ${settings.duration}s</p>
        </div>
    `;
    
    trendingGrid.prepend(item);
    if (trendingGrid.children.length > 12) {
        trendingGrid.removeChild(trendingGrid.lastChild);
    }
}

// Real API integration (for when you get API keys)
async function callRealAPI(settings) {
    // Option 1: Stability AI (like in the GitHub example) [citation:3]
    // const response = await fetch('https://api.stability.ai/v2beta/image-to-video', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${API_CONFIG.stabilityKey}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         prompt: settings.prompt,
    //         style: settings.style,
    //         duration: settings.duration
    //     })
    // });
    
    // Option 2: fal.ai with Veo3 (Google's model) [citation:6]
    // const response = await fetch('https://fal.run/fal-ai/veo3', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Key ${API_CONFIG.falKey}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         prompt: settings.prompt,
    //         duration: settings.duration + 's',
    //         resolution: '720p',
    //         aspect_ratio: settings.aspectRatio
    //     })
    // });
    
    throw new Error('API keys not configured');
}

// Download video
function downloadVideo() {
    const video = document.getElementById('generatedVideo');
    if (!video.src) {
        alert('Wali video ma samaysan!');
        return;
    }
    
    const link = document.createElement('a');
    link.download = `anime-${Date.now()}.mp4`;
    link.href = video.src;
    link.click();
}

// Share video
function shareVideo() {
    const video = document.getElementById('generatedVideo');
    if (navigator.share) {
        navigator.share({
            title: 'My Anime Creation',
            text: 'Check out this anime I made with AI!',
            url: video.src
        });
    } else {
        alert('Link copied to clipboard! (Demo)');
    }
}

// Remix video
function remixVideo() {
    const prompt = document.getElementById('promptInput');
    prompt.value += ' (remixed, more detailed)';
    generateVideo();
}

// Tab switching
function showTab(tabName) {
    // Simplified - you can expand this
    console.log('Switching to tab:', tabName);
}

// Initialize trending with examples
window.onload = function() {
    const examples = [
        { prompt: 'Samurai in cyberpunk city', style: 'anime-cyberpunk' },
        { prompt: 'Magical girl transformation', style: 'anime-modern' },
        { prompt: 'Dragon flying over mountains', style: 'anime-studio-ghibli' }
    ];
    
    examples.forEach(example => {
        addToTrending(null, {
            prompt: example.prompt,
            style: example.style,
            duration: '8',
            motion: 'static',
            aspectRatio: '16:9'
        });
    });
};
