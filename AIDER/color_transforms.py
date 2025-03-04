import torch
import torch.nn as nn
import torchvision.transforms.functional as F
from torchvision import transforms
import numpy as np

class HSVTransform:
    """Transform for HSV color space processing"""
    def __init__(self):
        self.hsv_ranges = {
            'fire': {'h': (0, 40), 's': (0.5, 1.0), 'v': (0.5, 1.0)},  # Red-orange hues for fire
            'flood': {'h': (180, 240), 's': (0.2, 0.8), 'v': (0.3, 0.7)},  # Blue hues for water
            'collapse': {'h': (20, 140), 's': (0.1, 0.5), 'v': (0.2, 0.6)}  # Brown-gray hues for debris
        }
    
    def rgb_to_hsv(self, img):
        if not isinstance(img, torch.Tensor):
            img = transforms.ToTensor()(img)
        
        # Ensure image is in range [0, 1]
        if img.max() > 1.0:
            img = img / 255.0
            
        # Get rgb components
        r, g, b = img[0], img[1], img[2]
        
        max_rgb, _ = torch.max(img, dim=0)
        min_rgb, _ = torch.min(img, dim=0)
        diff = max_rgb - min_rgb
        
        # Calculate hue
        hue = torch.zeros_like(max_rgb)
        
        # Red is max
        mask = (max_rgb == r) & (diff != 0)
        hue[mask] = 60 * ((g[mask] - b[mask]) / diff[mask])
        
        # Green is max
        mask = (max_rgb == g) & (diff != 0)
        hue[mask] = 60 * (2 + (b[mask] - r[mask]) / diff[mask])
        
        # Blue is max
        mask = (max_rgb == b) & (diff != 0)
        hue[mask] = 60 * (4 + (r[mask] - g[mask]) / diff[mask])
        
        hue = (hue + 360) % 360
        
        # Calculate saturation
        saturation = torch.zeros_like(max_rgb)
        mask = max_rgb != 0
        saturation[mask] = diff[mask] / max_rgb[mask]
        
        # Value is maximum of R,G,B
        value = max_rgb
        
        return torch.stack([hue, saturation, value])
    
    def enhance_hsv_features(self, img, disaster_type):
        """Enhance specific HSV ranges based on disaster type"""
        hsv_img = self.rgb_to_hsv(img)
        hsv_range = self.hsv_ranges.get(disaster_type, self.hsv_ranges['collapse'])
        
        # Apply selective HSV enhancement
        h, s, v = hsv_img[0], hsv_img[1], hsv_img[2]
        
        # Enhance hue range
        h_mask = (h >= hsv_range['h'][0]) & (h <= hsv_range['h'][1])
        h[h_mask] = torch.clip(h[h_mask] * 1.2, 0, 360)  # Boost relevant hues
        
        # Enhance saturation
        s_mask = (s >= hsv_range['s'][0]) & (s <= hsv_range['s'][1])
        s[s_mask] = torch.clip(s[s_mask] * 1.3, 0, 1)  # Boost relevant saturations
        
        # Enhance value
        v_mask = (v >= hsv_range['v'][0]) & (v <= hsv_range['v'][1])
        v[v_mask] = torch.clip(v[v_mask] * 1.2, 0, 1)  # Boost relevant values
        
        return torch.stack([h, s, v])

class DisasterAwareColorTransform:
    """Color transform specifically tuned for disaster images"""
    def __init__(self):
        self.hsv_transform = HSVTransform()
        self.color_emphasis = {
            'fire': (2.0, 1.5, 1.2),  # High saturation, moderate contrast
            'flood': (1.5, 1.8, 0.9),  # High contrast, lower brightness
            'collapse': (1.3, 1.6, 1.1)  # Moderate adjustments for structural details
        }
    
    def __call__(self, img):
        """Apply disaster-aware color transformations"""
        # Convert to HSV and enhance features
        hsv_enhanced = self.hsv_transform.enhance_hsv_features(img, 'fire')  # Default to fire detection
        
        # Apply color emphasis
        emphasis = self.color_emphasis['fire']  # Default to fire emphasis
        img = F.adjust_saturation(img, emphasis[0])
        img = F.adjust_contrast(img, emphasis[1])
        img = F.adjust_brightness(img, emphasis[2])
        
        return img

class AdaptiveColorNormalization(nn.Module):
    """Adaptive color normalization layer"""
    def __init__(self, num_features):
        super(AdaptiveColorNormalization, self).__init__()
        self.bn = nn.BatchNorm2d(num_features)
        self.color_attention = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Conv2d(num_features, num_features, 1),
            nn.ReLU(inplace=True),
            nn.Conv2d(num_features, num_features, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        # Apply batch normalization
        out = self.bn(x)
        
        # Apply color attention
        attention = self.color_attention(x)
        out = out * attention
        
        return out
