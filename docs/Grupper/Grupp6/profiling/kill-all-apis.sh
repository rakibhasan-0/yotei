#!/bin/bash

ps -ef | grep backend | grep -v grep | awk '{print $2}' | xargs kill