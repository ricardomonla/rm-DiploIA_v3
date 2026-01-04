#!/usr/bin/env python3
"""
Script to extract class number and name from the second slide of each PDF
in Clases_DiploIA and update the corresponding data.json files.
"""

import os
import json
import re
import PyPDF2

def extract_class_info(pdf_path):
    """
    Extract class number and name from the second slide of the PDF.
    """
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            if len(reader.pages) < 2:
                print(f"PDF {pdf_path} has less than 2 pages.")
                return None, None
            
            second_page = reader.pages[1]
            text = second_page.extract_text()
            
            # Extract class number using regex
            class_number_match = re.search(r'Clase\s+(\d+)', text)
            if not class_number_match:
                print(f"Could not find class number in {pdf_path}.")
                return None, None
            
            class_number = class_number_match.group(1)
            
            # Extract class name (lines before "Clase X")
            lines = text.split('\n')
            class_name_lines = []
            for line in lines:
                if line.strip() and 'Clase' not in line:
                    class_name_lines.append(line.strip())
                else:
                    break
            
            class_name = ' '.join(class_name_lines).strip()
            
            return class_number, class_name
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
        return None, None

def update_data_json(class_dir, class_number, class_name):
    """
    Update the data.json file in the class directory with the extracted info.
    """
    data_json_path = os.path.join(class_dir, 'data.json')
    
    try:
        with open(data_json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"data.json not found in {class_dir}")
        return
    except Exception as e:
        print(f"Error reading {data_json_path}: {e}")
        return
    
    # Update the data
    data['class_number'] = class_number
    data['class_name'] = class_name
    
    try:
        with open(data_json_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        print(f"Updated {data_json_path} with class_number: {class_number}, class_name: {class_name}")
    except Exception as e:
        print(f"Error writing to {data_json_path}: {e}")

def main():
    """
    Main function to process all PDFs in Clases_DiploIA.
    """
    clases_dir = 'Clases_DiploIA'
    
    if not os.path.exists(clases_dir):
        print(f"Directory {clases_dir} does not exist.")
        return
    
    for class_dir in os.listdir(clases_dir):
        class_path = os.path.join(clases_dir, class_dir)
        if not os.path.isdir(class_path):
            continue
        
        # Find the PDF file in the class directory
        pdf_file = None
        for file in os.listdir(class_path):
            if file.endswith('.pdf'):
                pdf_file = os.path.join(class_path, file)
                break
        
        if not pdf_file:
            print(f"No PDF found in {class_path}")
            continue
        
        # Extract class info from PDF
        class_number, class_name = extract_class_info(pdf_file)
        if class_number and class_name:
            update_data_json(class_path, class_number, class_name)

if __name__ == '__main__':
    main()