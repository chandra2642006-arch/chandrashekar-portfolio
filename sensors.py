print("🤖 My AI is ready!")

while True:
    command = input("You: ")

    if command.lower() == "hello":
        print("AI: Hello! How can I help you?")

    elif command.lower() == "bye":
        print("AI: Goodbye!")
        break

    else:
        print("AI: I don't understand that yet.")