module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Eduverify- get certificates from institutions with verification',
    version: '1.0.0',
    description: 'API documentation for Eduverify'
  },
  servers: [
    { 
      url: 'https://edu-verify-3rup.onrender.com', 
      description: 'Production server'
    }
  ],
  tags: [
    { name: 'Authentication', description: 'Authentication related endpoints' },
    { name: 'Admin Management', description: 'Admin Management related endpoints' },
    { name: 'Institution Management', description: 'Institution related endpoints' },
    { name: 'Course Management', description: 'Course Management related endpoints' },
    { name: 'Student Management', description: 'Student related endpoints' },
    { name: 'Certificate Verification', description: 'Certifcate verification related endpoints' },
    { name: 'Generate PDF', description: 'PDF related endpoints' }
  ],
  paths: {
    '/v1/auth/register': {
        post: {
            tags: ['Authentication'],
            summary: 'Register User / Institution',
            description: 'Registers a new user and institution. Also uploads institution logo if provided.',
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        institutionName: { type: 'string', example: 'Oxford Public School' },
                        institutionCode: { type: 'string', example: 'OXF123' },
                        institution_logo: {
                            type: 'object',
                            nullable: true,
                            description: 'Base64 formatted logo file',
                            properties: {
                                file_name: { type: 'string', example: 'institution_logo.jpg' },
                                baseString: { 
                                    type: 'string',
                                    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...' 
                                }
                            }
                        },
                        email: { type: 'string', example: 'example@gmail.com' },
                        password: { type: 'string', example: 'Pass@123' },
                        role: { type: 'string', example: 'admin' },
                        phone: { type: 'string', example: '9876543210' },
                        
                    },
                    required: ['email', 'password', 'role', 'phone', 'institutionName', 'institutionCode']
                }
                }
            }
            },
            responses: {
            '200': {
                description: 'User registered successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Registered successfully' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...' }
                    },
                    example: {
                        status: true,
                        message: 'Registered successfully',
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...'
                    }
                    }
                }
                }
            },
            '400': {
                description: 'Email already exists / missing fields',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Email already exists' }
                    }
                    }
                }
                }
            },
            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'Login User',
            description: 'Authenticates a user using email and password and generates a JWT token.',
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'example@gmail.com' },
                        password: { type: 'string', example: 'Pass@123' }
                        },
                        required: ['email', 'password']
                    }
                }
            }
            },
            responses: {
            '200': {
                description: 'User logged in successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'User logged in successfully' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...' }
                    },
                    example: {
                        status: true,
                        message: 'User logged in successfully',
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...'
                    }
                    }
                }
                }
            },
            '400': {
                description: 'Email is missing or password incorrect',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Password incorrect' }
                    }
                    }
                }
                }
            },
            '404': {
                description: 'Email not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Email not found' }
                    }
                    }
                }
                }
            },
            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/auth/refresh_token': {
        post: {
            tags: ['Authentication'],
            summary: 'Refresh Access Token',
            description:
            'Validates provided access token. If the token is still valid, it returns the same token. If expired, a new token is generated using the same JWT secret.',
            
            parameters: [
            {
                in: 'header',
                name: 'Authorization',
                required: true,
                description: 'Access token in Bearer format',
                schema: {
                type: 'string',
                example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...'
                }
            }
            ],

            responses: {
            '200': {
                description: 'Token validation result',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'New token generated' },
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' },
                        valid: { type: 'boolean', example: false }
                    },
                    example: {
                        message: 'New token generated',
                        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
                        valid: false
                    }
                    }
                }
                }
            },

            '401': {
                description: 'Invalid or missing token',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Authorization header missing' }
                    }
                    }
                }
                }
            },

            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Internal Server Error' }
                    }
                    }
                }
                }
            }
            }
        }
    },

    '/v1/admin/add_admin': {
        post: {
            tags: ['Admin Management'],
            summary: 'Add New Admin',
            description:
                'Creates a new admin by storing email and password in the database.',

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    example: 'admin@example.com'
                                },
                                password: {
                                    type: 'string',
                                    example: 'securePassword123'
                                }
                            },
                            required: ['email', 'password']
                        }
                    }
                }
            },

            responses: {
                '200': {
                    description: 'Admin added successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Admin added successfully' }
                                },
                                example: {
                                    status: true,
                                    message: 'Admin added successfully'
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Internal server error' }
                                },
                                example: {
                                    status: false,
                                    message: 'Internal server error'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/admin/admin_login': {
        post: {
            tags: ['Admin Management'],
            summary: 'Admin Login',
            description:
                'Allows an admin to log in using email and password. Returns a JWT token on successful login.',

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    example: 'admin@example.com'
                                },
                                password: {
                                    type: 'string',
                                    example: 'admin@123'
                                }
                            },
                            required: ['email', 'password']
                        }
                    }
                }
            },

            responses: {
                '200': {
                    description: 'Admin logged in successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Admin logged in successfully' },
                                    token: {
                                        type: 'string',
                                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                    }
                                },
                                example: {
                                    status: true,
                                    message: 'Admin logged in successfully',
                                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Admin not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Admin not found' }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Internal server error' }
                                }
                            },
                            example: {
                                status: false,
                                message: 'Internal server error'
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/admin/edit_admin': {
        put: {
            tags: ['Admin Management'],
            summary: 'Edit Admin Details',
            description:
                'Updates the details of an existing admin. Admin is identified using the email provided in the request body.',

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'Email of the admin to update',
                                    example: 'admin@example.com'
                                },
                                password: {
                                    type: 'string',
                                    description: 'New password for the admin',
                                    example: 'newpassword123'
                                }
                            },
                            required: ['email', 'password']
                        }
                    }
                }
            },

            responses: {
                '200': {
                    description: 'Admin edited successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Admin edited successfully'
                                    }
                                },
                                example: {
                                    status: true,
                                    message: 'Admin edited successfully'
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Admin not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Admin not found' }
                                }
                            },
                            example: {
                                status: false,
                                message: 'Admin not found'
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            },
                            example: {
                                status: false,
                                message: 'Internal server error'
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/admin/fetch_single_institution': {
        get: {
            tags: ['Admin Management'],
            summary: 'Fetch Single Institution With Students & Certificates',
            description:
                'Retrieves full institution details including logo URL, list of all students under that institution, and each student’s certificates with generated PDF URLs.',

            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    required: true,
                    description: 'The ID of the institution to fetch',
                    schema: {
                        type: 'string',
                        example: '6741a8b29f1c22380447da21'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Institution fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Institution fetched successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Institution details with students & certificates',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6741a8b29f1c22380447da21'
                                            },
                                            institutionName: {
                                                type: 'string',
                                                example: 'Oxford Public School'
                                            },
                                            institutionCode: {
                                                type: 'string',
                                                example: 'OXF123'
                                            },
                                            institution_logo: {
                                                type: 'string',
                                                example: 'logo_152312.png'
                                            },
                                            logo_url: {
                                                type: 'string',
                                                example: 'https://edu-verify-3rup.onrender.com/logos/logo_152312.png'
                                            },

                                            student_data: {
                                                type: 'array',
                                                description: 'List of students with their certificates',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example: '6741a9fc9f1c22380447dab2'
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'John Doe'
                                                        },
                                                        email: {
                                                            type: 'string',
                                                            example: 'john.doe@gmail.com'
                                                        },
                                                        mobile: {
                                                            type: 'string',
                                                            example: '9876543210'
                                                        },
                                                        profile_picture: {
                                                            type: 'string',
                                                            example: 'profile_99012.png'
                                                        },
                                                        profile_url: {
                                                            type: 'string',
                                                            example:
                                                                'https://edu-verify-3rup.onrender.com/profiles/profile_99012.png'
                                                        },
                                                        institution_id: {
                                                            type: 'string',
                                                            example: '6741a8b29f1c22380447da21'
                                                        },

                                                        certifcates: {
                                                            type: 'array',
                                                            description: 'Certificates belonging to the student',
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    _id: {
                                                                        type: 'string',
                                                                        example: '6841aa6b9f1c22380447ab91'
                                                                    },
                                                                    course_id: {
                                                                        type: 'string',
                                                                        example: '67239a0f57b122380473aa01'
                                                                    },
                                                                    pdf: {
                                                                        type: 'string',
                                                                        example: 'certificate_9981.pdf'
                                                                    },
                                                                    pdf_url: {
                                                                        type: 'string',
                                                                        example:
                                                                            'https://edu-verify-3rup.onrender.com/pdfs/certificate_9981.pdf'
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    example: {
                                        status: true,
                                        message: 'Institution fetched successfully',
                                        data: {
                                            _id: '6741a8b29f1c22380447da21',
                                            institutionName: 'Oxford Public School',
                                            institutionCode: 'OXF123',
                                            institution_logo: 'logo_152312.png',
                                            logo_url: 'https://edu-verify-3rup.onrender.com/logos/logo_152312.png',

                                            student_data: [
                                                {
                                                    _id: '6741a9fc9f1c22380447dab2',
                                                    name: 'John Doe',
                                                    email: 'john.doe@gmail.com',
                                                    mobile: '9876543210',
                                                    profile_picture: 'profile_99012.png',
                                                    profile_url:
                                                        'https://edu-verify-3rup.onrender.com/profiles/profile_99012.png',
                                                    institution_id: '6741a8b29f1c22380447da21',

                                                    certifcates: [
                                                        {
                                                            _id: '6841aa6b9f1c22380447ab91',
                                                            course_id: '67239a0f57b122380473aa01',
                                                            pdf: 'certificate_9981.pdf',
                                                            pdf_url:
                                                                'https://edu-verify-3rup.onrender.com/pdfs/certificate_9981.pdf'
                                                        }
                                                    ]
                                                },

                                                {
                                                    _id: '6741aa6b9f1c22380447dad9',
                                                    name: 'Priya Sharma',
                                                    email: 'priya.sharma@gmail.com',
                                                    mobile: '9898989898',
                                                    profile_picture: '',
                                                    profile_url: '',
                                                    institution_id: '6741a8b29f1c22380447da21',
                                                    certifcates: []
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Institution not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Institution not found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/admin/fetch_all_institutions': {
        get: {
            tags: ['Admin Management'],
            summary: 'Fetch Institutions (Paginated)',
            description:
                'Retrieves a paginated list of institutions. Each institution includes its basic details along with a generated logo URL if available.',

            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    required: false,
                    description: 'Page number for pagination (default: 1)',
                    schema: {
                        type: 'integer',
                        example: 1
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Institutions fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Data found successfully'
                                    },
                                    data: {
                                        type: 'array',
                                        description: 'List of institutions',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '691ac6c18ba874c77ec2d8b2'
                                                },
                                                institutionName: {
                                                    type: 'string',
                                                    example: 'Oxford Public School'
                                                },
                                                institutionCode: {
                                                    type: 'string',
                                                    example: 'OXF123'
                                                },
                                                institution_logo: {
                                                    type: 'string',
                                                    example: 'logo_152312.png',
                                                    nullable: true
                                                },
                                                logo_url: {
                                                    type: 'string',
                                                    example:
                                                        'https://edu-verify-3rup.onrender.com/logos/logo_152312.png'
                                                }
                                            }
                                        }
                                    }
                                },

                                example: {
                                    status: true,
                                    message: 'Data found successfully',
                                    data: [
                                        {
                                            _id: '691ac6c18ba874c77ec2d8b2',
                                            institutionName: 'Oxford Public School',
                                            institutionCode: 'OXF123',
                                            institution_logo: 'logo_152312.png',
                                            logo_url:
                                                'https://edu-verify-3rup.onrender.com/logos/logo_152312.png'
                                        },
                                        {
                                            _id: '691ac7bd8ba874c77ec2d912',
                                            institutionName: 'Cambridge International School',
                                            institutionCode: 'CAM889',
                                            institution_logo: '',
                                            logo_url: ''
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'No institutions available',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'No institutions available'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/admin/fetch_student_by_institution': {
        get: {
            tags: ['Admin Management'],
            summary: 'Fetch Students by Institution',
            description:
                'Retrieves institution details along with all students belonging to that institution. Automatically attaches the complete logo URL and student profile URLs if available.',

            parameters: [
                {
                    name: 'institution_id',
                    in: 'query',
                    required: true,
                    description: 'The ID of the institution whose students need to be fetched',
                    schema: {
                        type: 'string',
                        example: '6741a8b29f1c22380447da21'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Data fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Data fetched successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Institution details with students list',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6741a8b29f1c22380447da21'
                                            },
                                            institutionName: {
                                                type: 'string',
                                                example: 'Oxford Public School'
                                            },
                                            institutionCode: {
                                                type: 'string',
                                                example: 'OXF123'
                                            },
                                            institution_logo: {
                                                type: 'string',
                                                example: 'logo_152312.png',
                                                nullable: true
                                            },
                                            logo_url: {
                                                type: 'string',
                                                example: 'https://edu-verify-3rup.onrender.com/logos/logo_152312.png'
                                            },
                                            students: {
                                                type: 'array',
                                                description: 'List of students under this institution',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '6741a9fc9f1c22380447dab2'
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'John Doe'
                                                        },
                                                        email: {
                                                            type: 'string',
                                                            example: 'john.doe@gmail.com'
                                                        },
                                                        mobile: {
                                                            type: 'string',
                                                            example: '9876543210'
                                                        },
                                                        profile_picture: {
                                                            type: 'string',
                                                            example: 'profile_99012.png',
                                                            nullable: true
                                                        },
                                                        profile_url: {
                                                            type: 'string',
                                                            example:
                                                                'https://edu-verify-3rup.onrender.com/profiles/profile_99012.png'
                                                        },
                                                        institution_id: {
                                                            type: 'string',
                                                            example:
                                                                '6741a8b29f1c22380447da21'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },

                                example: {
                                    status: true,
                                    message: 'Data fetched successfully',
                                    data: {
                                        _id: '6741a8b29f1c22380447da21',
                                        institutionName: 'Oxford Public School',
                                        institutionCode: 'OXF123',
                                        institution_logo: 'logo_152312.png',
                                        logo_url: 'https://edu-verify-3rup.onrender.com/logos/logo_152312.png',
                                        students: [
                                            {
                                                _id: '6741a9fc9f1c22380447dab2',
                                                name: 'John Doe',
                                                email: 'john.doe@gmail.com',
                                                mobile: '9876543210',
                                                profile_picture: 'profile_99012.png',
                                                profile_url:
                                                    'https://edu-verify-3rup.onrender.com/profiles/profile_99012.png',
                                                institution_id:
                                                    '6741a8b29f1c22380447da21'
                                            },
                                            {
                                                _id: '6741aa6b9f1c22380447dad9',
                                                name: 'Priya Sharma',
                                                email: 'priya.sharma@gmail.com',
                                                mobile: '9898989898',
                                                profile_picture: '',
                                                profile_url: '',
                                                institution_id:
                                                    '6741a8b29f1c22380447da21'
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Institution not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Institution not found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },



    '/v1/institution/edit_institution': {
        put: {
            tags: ['Institution Management'],
            summary: 'Edit Institution Details',
            description:
            'Updates institution details including name, code, logo, and associated user account info (email, phone, password). If a new logo is uploaded, the old logo file is deleted and replaced.',

            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    id: {
                        type: 'string',
                        example: '691ac6c18ba874c77ec2d8b2',
                        description: 'Institution ID'
                    },
                    institutionName: {
                        type: 'string',
                        example: 'ABC Institute of Technology'
                    },
                    institutionCode: {
                        type: 'string',
                        example: 'AIT001'
                    },
                    email: {
                        type: 'string',
                        example: 'admin@abc.edu'
                    },
                    phone: {
                        type: 'string',
                        example: '9876543210'
                    },
                    password: {
                        type: 'string',
                        example: 'newPassword123'
                    },
                    institution_logo: {
                        type: 'object',
                        description: 'Base64 logo upload object',
                        properties: {
                        file_name: {
                            type: 'string',
                            example: 'logo.png'
                        },
                        baseString: {
                            type: 'string',
                            example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
                        }
                        }
                    }
                    },
                    required: ['id']
                }
                }
            }
            },

            responses: {
            '200': {
                description: 'Institution details updated successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: {
                        type: 'string',
                        example: 'Institution details updated successfully'
                        }
                    }
                    }
                }
                }
            },

            '404': {
                description: 'Institution or user not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: {
                        type: 'string',
                        example: 'Institution not found'
                        }
                    }
                    }
                }
                }
            },

            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: {
                        type: 'string',
                        example: 'Internal server error'
                        }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/institution/stats': {
        get: {
            tags: ['Institution Management'],
            summary: 'Fetch Institution Statistics',
            description:
                'Retrieves detailed statistics for a specific institution, including total students, active, expired, and revoked counts.',

            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    required: true,
                    description: 'Institution ID',
                    schema: { type: 'string', example: '691b277276e996e1f997e51c' }
                }
            ],

            responses: {
                '200': {
                    description: 'Institution stats fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Data found successfully' },
                                    data: {
                                        type: 'object',
                                        description: 'Institution details with stats',
                                        properties: {
                                            _id: { type: 'string', example: '691b277276e996e1f997e51c' },
                                            institutionName: { type: 'string', example: 'Oxford Public School' },
                                            institutionCode: { type: 'string', example: 'OXF123' },
                                            institution_logo: {
                                                type: 'string',
                                                example: 'https://edu-verify-3rup.onrender.com/logos/logo_952314.png'
                                            },
                                            total_students: { type: 'number', example: 120 },
                                            active_students: { type: 'number', example: 100 },
                                            expired_students: { type: 'number', example: 10 },
                                            revoked_students: { type: 'number', example: 10 }
                                        }
                                    }
                                },

                                example: {
                                    status: true,
                                    message: 'Data found successfully',
                                    data: {
                                        _id: '691b277276e996e1f997e51c',
                                        institutionName: 'Oxford Public School',
                                        institutionCode: 'OXF123',
                                        institution_logo: 'https://edu-verify-3rup.onrender.com/logos/logo_952314.png',
                                        total_students: 120,
                                        active_students: 100,
                                        expired_students: 10,
                                        revoked_students: 10
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Institution not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Data not found' }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Internal server error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    '/v1/course/add_course': {
        post: {
            tags: ['Course Management'],
            summary: 'Add New Course',
            description:
                'Creates and stores a new course under a specific institution. Includes course name, price, duration, and languages.',

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                institution_id: {
                                    type: 'string',
                                    example: '6741a8b29f1c22380447da21',
                                    description: 'ID of the institution to which the course belongs'
                                },
                                name: {
                                    type: 'string',
                                    example: 'Full Stack Development',
                                    description: 'Name of the course'
                                },
                                price: {
                                    type: 'number',
                                    example: 15000,
                                    description: 'Course fee'
                                },
                                duration: {
                                    type: 'string',
                                    example: '3 Months',
                                    description: 'Course duration'
                                },
                                languages: {
                                    type: 'array',
                                    example: ['Java', 'Python'],
                                    items: { type: 'string' },
                                    description: 'Languages available for this course'
                                }
                            },

                            example: {
                                institution_id: '6741a8b29f1c22380447da21',
                                name: 'Full Stack Development',
                                price: 15000,
                                duration: '3 Months',
                                languages: ['English', 'Hindi']
                            }
                        }
                    }
                }
            },

            responses: {
                '200': {
                    description: 'Course added successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Course added successfully'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/course/fetch_all_course': {
        get: {
            tags: ['Course Management'],
            summary: 'Fetch All Courses by Institution',
            description:
                'Retrieves all courses that belong to a specific institution.',

            parameters: [
                {
                    name: 'institution_id',
                    in: 'query',
                    required: true,
                    description: 'The ID of the institution whose courses need to be fetched',
                    schema: {
                        type: 'string',
                        example: '6741a8b29f1c22380447da21'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Courses found successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Courses found successfully'
                                    },
                                    data: {
                                        type: 'array',
                                        description: 'List of courses under the institution',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '6741b2a09f1c22380447df91'
                                                },
                                                institution_id: {
                                                    type: 'string',
                                                    example: '6741a8b29f1c22380447da21'
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'Full Stack Development'
                                                },
                                                price: {
                                                    type: 'number',
                                                    example: 15000
                                                },
                                                duration: {
                                                    type: 'string',
                                                    example: '3 Months'
                                                },
                                                languages: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                    example: ['English', 'Hindi']
                                                }
                                            }
                                        }
                                    }
                                },

                                example: {
                                    status: true,
                                    message: 'Courses found successfully',
                                    data: [
                                        {
                                            _id: '6741b2a09f1c22380447df91',
                                            institution_id: '6741a8b29f1c22380447da21',
                                            name: 'Full Stack Development',
                                            price: 15000,
                                            duration: '3 Months',
                                            languages: ['English', 'Hindi']
                                        },
                                        {
                                            _id: '6741b3019f1c22380447dfa1',
                                            institution_id: '6741a8b29f1c22380447da21',
                                            name: 'Data Science',
                                            price: 18000,
                                            duration: '4 Months',
                                            languages: ['English']
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'No courses found for this institution',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'No courses found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/course/fetch_single_course': {
        get: {
            tags: ['Course Management'],
            summary: 'Fetch Single Course',
            description: 'Retrieves full details of a specific course using its course ID.',

            parameters: [
                {
                    name: 'course_id',
                    in: 'query',
                    required: true,
                    description: 'The ID of the course that needs to be fetched',
                    schema: {
                        type: 'string',
                        example: '6741b2a09f1c22380447df91'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Course found successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Course found successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Course details',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6741b2a09f1c22380447df91'
                                            },
                                            institution_id: {
                                                type: 'string',
                                                example: '6741a8b29f1c22380447da21'
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'Full Stack Development'
                                            },
                                            price: {
                                                type: 'number',
                                                example: 15000
                                            },
                                            duration: {
                                                type: 'string',
                                                example: '3 Months'
                                            },
                                            languages: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                example: ['English', 'Hindi']
                                            }
                                        }
                                    }
                                },

                                example: {
                                    status: true,
                                    message: 'Course found successfully',
                                    data: {
                                        _id: '6741b2a09f1c22380447df91',
                                        institution_id: '6741a8b29f1c22380447da21',
                                        name: 'Full Stack Development',
                                        price: 15000,
                                        duration: '3 Months',
                                        languages: ['English', 'Hindi']
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Course not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Course not found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/course/edit_course': {
        put: {
            tags: ['Course Management'],
            summary: 'Edit Course',
            description:
                'Updates the details of an existing course. Only provided fields will be updated.',

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                course_id: {
                                    type: 'string',
                                    example: '6741b2a09f1c22380447df91'
                                },
                                name: {
                                    type: 'string',
                                    example: 'Advanced Full Stack Development',
                                    nullable: true
                                },
                                price: {
                                    type: 'number',
                                    example: 18000,
                                    nullable: true
                                },
                                duration: {
                                    type: 'string',
                                    example: '4 Months',
                                    nullable: true
                                },
                                languages: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['English', 'Hindi'],
                                    nullable: true
                                }
                            },
                            required: ['course_id']
                        }
                    }
                }
            },

            responses: {
                '200': {
                    description: 'Course edited successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Course edited successfully'
                                    }
                                },
                                example: {
                                    status: true,
                                    message: 'Course edited successfully'
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Course not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Course not found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/course/delete_course': {
        delete: {
            tags: ['Course Management'],
            summary: 'Delete Course',
            description: 'Deletes a course from the database using the course ID.',

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                course_id: {
                                    type: 'string',
                                    example: '691acb45c67508ff194cb6a2',
                                    description: 'ID of the course to be deleted'
                                }
                            },
                            required: ['course_id']
                        }
                    }
                }
            },

            responses: {
                '200': {
                    description: 'Course deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Course deleted successfully' }
                                },
                                example: {
                                    status: true,
                                    message: 'Course deleted successfully'
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Internal server error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },


    '/v1/student/add_student': {
        post: {
            tags: ['Student Management'],
            summary: 'Add Student',
            description: 'Adds a new student, creates user entry, student entry, generates certificate, and creates a QR code image.',
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    institution_id: { type: 'string', example: '691ac6c18ba874c77ec2d8b2' },
                    name: { type: 'string', example: 'John Doe' },
                    phone: { type: 'string', example: '9876543210' },
                    course_id: { type: 'string', example: '69200d58ce1a001549c15208' },
                    branch: { type: 'string', example: 'CSE' },
                    yearOfStudy: { type: 'string', example: '2023' },
                    role: { type: 'string', example: 'student' },
                    email: { type: 'string', example: 'example@gmail.com' },
                    password: { type: 'string', example: 'Pass@123' },
                    profile_picture: {
                        type: 'object',
                        nullable: true,
                        description: 'Base64 formatted profile image',
                        properties: {
                            file_name: { type: 'string', example: 'profile.jpg' },
                            baseString: {
                                type: 'string',
                                example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...'
                            }
                        }
                    }
                    },
                    required: [
                        'institution_id',
                        'name',
                        'phone',
                        'course_id',
                        'branch',
                        'yearOfStudy',
                        'role',
                        'status',
                        'email',
                        'password'
                    ]
                }
                }
            }
            },
            responses: {
            '200': {
                description: 'Student added successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Student added successfully' }
                    },
                    example: {
                        status: true,
                        message: 'Student added successfully'
                    }
                    }
                }
                }
            },
            '400': {
                description: 'Missing fields or validation error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Missing required fields' }
                    }
                    }
                }
                }
            },
            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/student/fetch_single_student': {
        get: {
            tags: ['Student Management'],
            summary: 'Fetch Single Student Details',
            description:
                'Fetches complete details of a single student including profile image, certificate list, certificate PDFs, and course details.',

            parameters: [
                {
                    name: 'stud_id',
                    in: 'query',
                    required: true,
                    description: 'Student ID',
                    schema: {
                        type: 'string',
                        example: '6742c8db5ff12a67c45f89b1'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Student fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Student fetched successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Student full profile details',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6742c8db5ff12a67c45f89b1'
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'John Doe'
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'john.doe@gmail.com'
                                            },
                                            phone: {
                                                type: 'string',
                                                example: '9876543210'
                                            },
                                            institution_id: {
                                                type: 'string',
                                                example: '691ac6c18ba874c77ec2d8b2'
                                            },
                                            profile_picture: {
                                                type: 'string',
                                                example: 'profile_12345.jpg'
                                            },
                                            profile_url: {
                                                type: 'string',
                                                example:
                                                    'https://edu-verify-3rup.onrender.com/profiles/profile_12345.jpg'
                                            },

                                            certificates: {
                                                type: 'array',
                                                description: 'List of student certificates',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example: '6742cab25ff12a67c45f8a44'
                                                        },
                                                        course_id: {
                                                            type: 'string',
                                                            example: '6742c9525ff12a67c45f89e8'
                                                        },
                                                        course_name: {
                                                            type: 'string',
                                                            example: 'Full Stack Development'
                                                        },
                                                        pdf: {
                                                            type: 'string',
                                                            example: 'cert_2024.pdf'
                                                        },
                                                        pdf_url: {
                                                            type: 'string',
                                                            example:
                                                                'https://edu-verify-3rup.onrender.com/certificates/cert_2024.pdf'
                                                        },
                                                        issued_on: {
                                                            type: 'string',
                                                            example: '2024-11-20'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    example: {
                                        status: true,
                                        message: 'Student fetched successfully',
                                        data: {
                                            _id: '6742c8db5ff12a67c45f89b1',
                                            name: 'John Doe',
                                            email: 'john.doe@gmail.com',
                                            phone: '9876543210',
                                            institution_id: '691ac6c18ba874c77ec2d8b2',
                                            profile_picture: 'profile_12345.jpg',
                                            profile_url:
                                                'https://edu-verify-3rup.onrender.com/profiles/profile_12345.jpg',

                                            certificates: [
                                                {
                                                    _id: '6742cab25ff12a67c45f8a44',
                                                    course_id: '6742c9525ff12a67c45f89e8',
                                                    course_name: 'Full Stack Development',
                                                    pdf: 'cert_2024.pdf',
                                                    pdf_url:
                                                        'https://edu-verify-3rup.onrender.com/certificates/cert_2024.pdf',
                                                    issued_on: '2024-11-20'
                                                },
                                                {
                                                    _id: '6742cad05ff12a67c45f8a99',
                                                    course_id: '6742ca105ff12a67c45f89f0',
                                                    course_name: 'UI/UX Basics',
                                                    pdf: '',
                                                    pdf_url: ''
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Student data not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Student data not found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/student/edit_student': {
        put: {
            tags: ['Student Management'],
            summary: 'Edit Student Details',
            description: 'Updates student and user details including profile picture, course_id, branch, email, phone number, and password.',

            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    id: { type: 'string', example: '691acb45c67508ff194cb6a2' },
                    email: { type: 'string', example: 'student123@gmail.com' },
                    phone: { type: 'string', example: '9876543210' },
                    password: { type: 'string', example: 'NewPass@123' },
                    name: { type: 'string', example: 'John Doe' },
                    course_id: { type: 'string', example: '69200d58ce1a001549c15208' },
                    branch: { type: 'string', example: 'CSE' },
                    profile_picture: {
                        type: 'object',
                        nullable: true,
                        description: 'Base64 formatted profile picture',
                        properties: {
                        file_name: { type: 'string', example: 'profile.jpg' },
                        baseString: {
                            type: 'string',
                            example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...'
                        }
                        }
                    }
                    },
                    required: ['id']
                }
                }
            }
            },

            responses: {
            '200': {
                description: 'Student details updated successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Student details updated successfully' }
                    },
                    example: {
                        status: true,
                        message: 'Student details updated successfully'
                    }
                    }
                }
                }
            },

            '404': {
                description: 'Student or user not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Student data not found' }
                    }
                    }
                }
                }
            },

            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/student/delete_student': {
        delete: {
            tags: ['Student Management'],
            summary: 'Delete Student',
            description:
            'Soft deletes a student and associated user by setting `is_delete: true` for both student and user records.',

            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    student_id: {
                        type: 'string',
                        example: '691acb45c67508ff194cb6a2',
                        description: 'ID of the student to delete'
                    }
                    },
                    required: ['student_id']
                }
                }
            }
            },

            responses: {
            '200': {
                description: 'Student deleted successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Student deleted successfully' }
                    },
                    example: {
                        status: true,
                        message: 'Student deleted successfully'
                    }
                    }
                }
                }
            },

            '404': {
                description: 'Student or user not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Student not found' }
                    }
                    }
                }
                }
            },

            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/student/profile': {
        get: {
            tags: ['Student Management'],
            summary: 'Fetch Student Profile',
            description:
                'Retrieves complete profile details of a student including personal information and all certificates linked to the student. Each certificate contains its PDF URL and course name.',

            parameters: [
                {
                    name: 'student_id',
                    in: 'query',
                    required: true,
                    description: 'The ID of the student whose profile needs to be fetched',
                    schema: {
                        type: 'string',
                        example: '6742c8db5ff12a67c45f89b1'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Student profile fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Data fetched successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Student profile with certificates',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '6742c8db5ff12a67c45f89b1'
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'John Doe'
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'john.doe@gmail.com'
                                            },
                                            mobile: {
                                                type: 'string',
                                                example: '9876543210'
                                            },
                                            profile_picture: {
                                                type: 'string',
                                                example: 'profile_123.png',
                                                nullable: true
                                            },
                                            certificates_data: {
                                                type: 'array',
                                                description: 'List of certificates belonging to the student',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example: '6742ca9d5ff12a67c45f8a22'
                                                        },
                                                        student_id: {
                                                            type: 'string',
                                                            example: '6742c8db5ff12a67c45f89b1'
                                                        },
                                                        course_id: {
                                                            type: 'string',
                                                            example: '6742c9525ff12a67c45f89e8'
                                                        },
                                                        course_name: {
                                                            type: 'string',
                                                            example: 'Full Stack Web Development'
                                                        },
                                                        pdf: {
                                                            type: 'string',
                                                            example: 'cert_20241201.pdf',
                                                            nullable: true
                                                        },
                                                        pdf_url: {
                                                            type: 'string',
                                                            example: 'https://edu-verify-3rup.onrender.com/certificates/cert_20241201.pdf'
                                                        },
                                                        issue_date: {
                                                            type: 'string',
                                                            example: '2024-11-15'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    example: {
                                        status: true,
                                        message: 'Data fetched successfully',
                                        data: {
                                            _id: '6742c8db5ff12a67c45f89b1',
                                            name: 'John Doe',
                                            email: 'john.doe@gmail.com',
                                            mobile: '9876543210',
                                            profile_picture: 'profile_123.png',
                                            certificates_data: [
                                                {
                                                    _id: '6742ca9d5ff12a67c45f8a22',
                                                    student_id: '6742c8db5ff12a67c45f89b1',
                                                    course_id: '6742c9525ff12a67c45f89e8',
                                                    course_name: 'Full Stack Web Development',
                                                    pdf: 'cert_20241201.pdf',
                                                    pdf_url:
                                                        'https://edu-verify-3rup.onrender.com/certificates/cert_20241201.pdf',
                                                    issue_date: '2024-11-15'
                                                },
                                                {
                                                    _id: '6742cb0d5ff12a67c45f8ac9',
                                                    student_id: '6742c8db5ff12a67c45f89b1',
                                                    course_id: '6742c9bd5ff12a67c45f89f9',
                                                    course_name: 'UI/UX Fundamentals',
                                                    pdf: '',
                                                    pdf_url: ''
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Student not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Student not found'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },    
    '/v1/student/fetch_student_by_search': {
        get: {
            tags: ['Student Management'],
            summary: 'Search Students',
            description:
            'Fetches paginated student data using search keyword, status filter, and pagination. Search is applied on name and email fields.',

            parameters: [
            {
                name: 'search',
                in: 'query',
                required: false,
                description: 'Search keyword to filter by name or email',
                schema: {
                type: 'string',
                example: 'John'
                }
            },
            {
                name: 'institution_id',
                in: 'query',
                required: false,
                description: 'Unique ID of the Institution',
                schema: {
                    type: 'string',
                    example: '69200d58ce1a001549c15208'
                }
            },
            {
                name: 'status',
                in: 'query',
                required: false,
                description: 'Filter students by status (e.g., active/inactive)',
                schema: {
                type: 'string',
                example: 'active'
                }
            },
            {
                name: 'page',
                in: 'query',
                required: false,
                description: 'Page number for pagination (default: 1)',
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
            ],

            responses: {
            '200': {
                description: 'Student data fetched successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Data fetched successfully' },
                        total_count: { type: 'number', example: 120 },
                        total_pages: { type: 'number', example: 6 },
                        data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            example: {
                                _id: '691acb45c67508ff194cb6a1',
                                name: 'John Doe',
                                email: 'John@example.com',
                                phone: '9876543210',
                                status: 'active',
                                profile_url: 'https://example.com/profile/profile_12345.png'
                            }
                        }
                        }
                    },
                    example: {
                        status: true,
                        message: 'Data fetched successfully',
                        total_count: 120,
                        total_pages: 6,
                        data: [
                        {
                            _id: '691acb45c67508ff194cb6a1',
                            name: 'John Doe',
                            email: 'John@example.com',
                            phone: '9876543210',
                            status: 'active',
                            profile_url:
                            'https://example.com/profile/profile_12345.png'
                        }
                        ]
                    }
                    }
                }
                }
            },

            '404': {
                description: 'No student data found',
                content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: { type: 'boolean', example: false },
                            message: { type: 'string', example: 'No data found' }
                        }
                    }
                }
                }
            },

            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },
    '/v1/student/fetch_certificates': {
        get: {
            tags: ['Student Management'],
            summary: 'Fetch Certificates of a Student',
            description:
                'Retrieves all certificates issued to a student. Each certificate includes course details and a PDF download URL (if available).',

            parameters: [
                {
                    name: 'student_id',
                    in: 'query',
                    required: true,
                    description: 'The ID of the student whose certificates need to be fetched',
                    schema: {
                        type: 'string',
                        example: '6742c8db5ff12a67c45f89b1'
                    }
                }
            ],

            responses: {
                '200': {
                    description: 'Certificates fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Data fetched successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Student profile with certificate list',
                                        properties: {
                                            _id: { type: 'string', example: '6742c8db5ff12a67c45f89b1' },
                                            name: { type: 'string', example: 'John Doe' },
                                            email: { type: 'string', example: 'john.doe@gmail.com' },

                                            certificate_data: {
                                                type: 'array',
                                                description: 'List of certificates issued to this student',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example: '6742ca9d5ff12a67c45f8a22'
                                                        },
                                                        student_id: {
                                                            type: 'string',
                                                            example: '6742c8db5ff12a67c45f89b1'
                                                        },
                                                        course_id: {
                                                            type: 'string',
                                                            example: '6742c9525ff12a67c45f89e8'
                                                        },
                                                        course_name: {
                                                            type: 'string',
                                                            example: 'Full Stack Web Development'
                                                        },
                                                        pdf: {
                                                            type: 'string',
                                                            example: 'cert_20241201.pdf',
                                                            nullable: true
                                                        },
                                                        pdf_url: {
                                                            type: 'string',
                                                            example:
                                                                'https://edu-verify-3rup.onrender.com/certificates/cert_20241201.pdf'
                                                        },
                                                        issue_date: {
                                                            type: 'string',
                                                            example: '2024-12-01'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    example: {
                                        status: true,
                                        message: 'Data fetched successfully',
                                        data: {
                                            _id: '6742c8db5ff12a67c45f89b1',
                                            name: 'John Doe',
                                            email: 'john.doe@gmail.com',

                                            certificate_data: [
                                                {
                                                    _id: '6742ca9d5ff12a67c45f8a22',
                                                    student_id: '6742c8db5ff12a67c45f89b1',
                                                    course_id: '6742c9525ff12a67c45f89e8',
                                                    course_name: 'Full Stack Web Development',
                                                    pdf: 'cert_20241201.pdf',
                                                    pdf_url:
                                                        'https://edu-verify-3rup.onrender.com/certificates/cert_20241201.pdf',
                                                    issue_date: '2024-12-01'
                                                },
                                                {
                                                    _id: '6742cb0d5ff12a67c45f8ac9',
                                                    student_id: '6742c8db5ff12a67c45f89b1',
                                                    course_id: '6742c9bd5ff12a67c45f89f9',
                                                    course_name: 'UI/UX Fundamentals',
                                                    pdf: '',
                                                    pdf_url: ''
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                '404': {
                    description: 'Student not found OR No certificates available',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'No certificates available'
                                    }
                                }
                            }
                        }
                    }
                },

                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal server error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/v1/student/revoke_student': {
        put: {
            tags: ['Student Management'],
            summary: 'Revoke Student',
            description: 'Revokes a student by updating both the user and student status to "revoked".',
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    student_id: {
                        type: 'string',
                        example: '691acb45c67508ff194cb6a2'
                    }
                    },
                    required: ['student_id']
                }
                }
            }
            },
            responses: {
            '200': {
                description: 'Student revoked successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Student revoked successfully' }
                    },
                    example: {
                        status: true,
                        message: 'Student revoked successfully'
                    }
                    }
                }
                }
            },
            '404': {
                description: 'Student not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Student not found' }
                    }
                    }
                }
                }
            },
            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' }
                    }
                    }
                }
                }
            }
            }
        }
    },

    '/v1/verify/verify_certificate': {
        get: {
            tags: ['Certificate Verification'],
            summary: 'Verify Certificate',
            description: 'Verifies a certificate using certificate ID and returns whether it is valid or expired.',
            parameters: [
            {
                name: 'certificate_id',
                in: 'query',
                required: true,
                description: 'Certificate ID to verify',
                schema: {
                type: 'string',
                example: '691b277276e996e1f997e51b'
                }
            }
            ],
            responses: {
            '200': {
                description: 'Certificate verification result',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: "Student's certificate is valid!" }
                    },
                    examples: {
                        valid: {
                        value: {
                            status: true,
                            message: "Student's certificate is valid!"
                        }
                        },
                        expired: {
                        value: {
                            status: true,
                            message: "Student's certificate is expired!"
                        }
                        }
                    }
                    }
                }
                }
            },
            '404': {
                description: 'Certificate not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Certificate not found' }
                    }
                    }
                }
                }
            },
            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal Server Error' }
                    }
                    }
                }
                }
            }
            }
        }
    },

    '/v1/pdf/generate_pdf': {
        post: {
            tags: ['Generate PDF'],
            summary: 'Generate Certificate PDF',
            description:
            'Generates a certificate PDF for a student based on the certificate ID. ' +
            'The PDF includes borders, student details, institution logo, QR code, and design elements.',

            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    certificate_id: {
                        type: 'string',
                        description: 'Certificate ID for which PDF will be generated',
                        example: '691b277276e996e1f997e51b'
                    }
                    },
                    required: ['certificate_id']
                }
                }
            }
            },

            responses: {
            '200': {
                description: 'PDF generated successfully',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'PDF generated successfully' }
                    },
                    example: {
                        status: true,
                        message: 'PDF generated successfully'
                    }
                    }
                }
                }
            },

            '404': {
                description: 'Certificate not found',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Certificate not found' }
                    },
                    example: {
                        status: false,
                        message: 'Certificate not found'
                    }
                    }
                }
                }
            },

            '500': {
                description: 'Internal server error',
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal Server Error' }
                    },
                    example: {
                        status: false,
                        message: 'Internal Server Error'
                    }
                    }
                }
                }
            }
            }
        }
    }

  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      // createBookRequest: {
      //   type: 'object',
      //   required: ['action', 'user_id', 'book_name'],
      //   properties: {
      //     action: {
      //       type: 'string',
      //       enum: ['create-book'],
      //       example: 'create-book'
      //     },
      //     user_id: {
      //       type: 'string',
      //       example: '6809d555c0b1e7dbca778816'
      //     },
      //     book_name: {
      //       type: 'string',
      //       example: 'My Life'
      //     }
      //   }
      // },

    }
  },

  security: [{
    bearerAuth: []
  }]
};
