import hashlib

with open('hashes.txt', 'r') as file:
    hashes = file.read().splitlines()

with open('dictionary.txt', 'r') as file:
    dictionary = file.read().splitlines()

for hash in hashes:
    for pw in dictionary:
        if hashlib.sha256(pw.encode()).hexdigest() == hash:
            print(pw)