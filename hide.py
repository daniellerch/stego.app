
from stegoapp import *


image = base64_to_image(g_image_url)
I = np.array(image)

Is = I.copy()
error = True
for i in range(10):
    print("Embedding attempt", i)
    Is = hide(Is, g_message, g_password)
    extracted_message = extract(Is, g_password)
    if g_message in extracted_message:
        error = False
        break

if not error:
    g_b64image = image_to_base64(Is)
else:
    g_b64image = ''






