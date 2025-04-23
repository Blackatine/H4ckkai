from setuptools import setup, find_packages

setup(
    name="chatbot",
    version="0.1.0",
    description="A cybersecurity-focused chatbot with knowledge base learning capabilities",
    author="Your Name",
    packages=find_packages(),
    python_requires=">=3.7",
    install_requires=[
        'flask>=2.0.3',
        'requests>=2.26.0',
        'python-dotenv>=0.19.0',
        'setuptools>=65.5.1',
        'wheel>=0.38.4',
        'pyyaml>=6.0',
        'python-magic>=0.4.27',
        'markdown>=3.4.3',
        'toml>=0.10.2',
        'xmltodict>=0.13.0',
        'PyPDF2>=3.0.0',
        'pdfplumber>=0.10.2',
        'nltk>=3.8.1',
    ],
    extras_require={
        'dev': [
            'pytest>=7.0.0',
            'black>=22.0.0',
            'flake8>=4.0.0',
        ]
    },
    entry_points={
        'console_scripts': [
            'run-chatbot=web.app:main',
        ],
    },
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Security',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
    ],
) 