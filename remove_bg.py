import cv2
import numpy as np
import sys

image_path = r"c:\Users\V\Downloads\IMG_20260425_103009.jpg"
img = cv2.imread(image_path)
if img is None:
    print(f"Error: Could not read image from {image_path}")
    sys.exit(1)

# Method 1: All ink (we already did this, but let's improve it)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 51, 15)
mask_all = cv2.bitwise_not(thresh)
mask_all = cv2.medianBlur(mask_all, 3)

b, g, r = cv2.split(img)
rgba_all = cv2.merge((b, g, r, mask_all))
cv2.imwrite(r"c:\Users\V\Desktop\FurryWaves\firma_y_texto_transparente.png", rgba_all)

# Method 2: Only blue ink (HSV thresholding)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Hue for blue is ~120. Range 90-150 covers most blues
lower_blue = np.array([80, 20, 0])
upper_blue = np.array([160, 255, 255])
mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)

# Dilation to grab the dark edges of the ink that might fall out of the color range
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
mask_blue = cv2.dilate(mask_blue, kernel, iterations=1)
mask_blue = cv2.GaussianBlur(mask_blue, (3,3), 0)

# To ensure the signature is fully opaque in the center, we can scale the mask up or just use the mask as alpha
rgba_blue = cv2.merge((b, g, r, mask_blue))
cv2.imwrite(r"c:\Users\V\Desktop\FurryWaves\solo_firma_transparente.png", rgba_blue)

print("Saved both versions.")
