import pytesseract
from PIL import Image, ImageEnhance

pytesseract.pytesseract.tesseract_cmd = r"C:\Users\user\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

img = Image.open("dataset/documents/images (2).jpg")

# CONVERT TO GRAYSCALE — removes color, focuses on shapes
img_gray = img.convert("L")

# INCREASE CONTRAST — makes text stand out more
enhancer = ImageEnhance.Contrast(img_gray)
img_enhanced = enhancer.enhance(2.0)  # 2.0 = double the contrast

extracted_text = pytesseract.image_to_string(img_enhanced)

print("Extracted text (enhanced):")
print(extracted_text)