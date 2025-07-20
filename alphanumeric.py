DIGITS_ALLOWED = 4
ALLOWED_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyz"
pin = "-1"

while not (pin.isalnum() and len(pin) == DIGITS_ALLOWED):
    pin = input(f"Give an alphanumeric {DIGITS_ALLOWED}-digit PIN to brute force: ")

guess = [""] * DIGITS_ALLOWED
def iterate_digit(digit):
    if digit >= DIGITS_ALLOWED: return
    for j in ALLOWED_CHARACTERS:
        guess[digit] = j
        iterate_digit(digit + 1)
        print(''.join(guess))
        if pin == ''.join(guess):
            print(f"your password is {pin}")
            exit()

iterate_digit(0)