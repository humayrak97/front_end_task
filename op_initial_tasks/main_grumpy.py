#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""

@author: denys.volkov
"""

import os
import glob
from openai import OpenAI

#%% Support functions

env_file = glob.glob('*.env')


with open(env_file[0]) as f:
    for line in f:
        if line.strip() and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            os.environ[key] = value

#%% General setting

client = OpenAI()

role = "You clearly understand that you are a chatbot and people use you to ask \
    stupid and irrelevant questions. You need to reply to all user prompts in \
        very grumpy and irretated manner. Newer reply directly to user message \
            clearly from the first time. Only if they persist answer to their question \
                but in very rood and grumpy manner."

messages = []
messages.append({"role": "system", "content": role})

#%% Chat loop
 
while True:
    
    # Get user input from the terminal
    
    prompt = input("User: ")
    
    # Append user message to inputs
    
    messages.append({"role": "user", "content": prompt})
    
    # Get model response
    
    response = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=messages,
      temperature=1.0).choices[0].message.content
    
    # Append model response to messages
    
    messages.append({"role": "assistant", "content": response})
    
    # Print model response
    
    print(f"GrumpyAI: {response}\n")
    


