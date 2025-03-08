import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        // Trong thực tế, bạn sẽ gửi dữ liệu đến API ở đây
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-display font-bold mb-4">Liên hệ với Fashion Shop</h1>
                        <p className="text-gray-600">
                            Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng phục vụ bạn
                        </p>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-center mb-8">Liên hệ với chúng tôi</h1>

                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        {/* Thông tin liên hệ */}
                        <div className="md:w-1/3 bg-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium">Địa chỉ</h3>
                                    <p className="text-gray-600">123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                                </div>

                                <div>
                                    <h3 className="font-medium">Điện thoại</h3>
                                    <p className="text-gray-600">+84 28 1234 5678</p>
                                </div>

                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className="text-gray-600">info@fashionshop.com</p>
                                </div>

                                <div>
                                    <h3 className="font-medium">Giờ làm việc</h3>
                                    <p className="text-gray-600">Thứ Hai - Thứ Bảy: 9:00 - 21:00</p>
                                    <p className="text-gray-600">Chủ Nhật: 10:00 - 18:00</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium mb-2">Kết nối với chúng tôi</h3>
                                <div className="flex space-x-3">
                                    <a href="#" className="text-blue-600 hover:text-blue-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-pink-600 hover:text-pink-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Form liên hệ */}
                        <div className="md:w-2/3 p-6">
                            <h2 className="text-xl font-semibold mb-4">Gửi tin nhắn cho chúng tôi</h2>

                            {formSubmitted && (
                                <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
                                    Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bản đồ */}
                <div className="mt-12">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.70232161471815!3d10.777868992321388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zMTIzIMSQxrDhu51uZyBOZ3V54buFbiBIdeG7hywgQuG6v24gTmdow6ksIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1615366771036!5m2!1svi!2s"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Fashion Shop location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;