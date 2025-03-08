import React from 'react';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold mb-4">Về Fashion Shop</h1>
            <p className="text-gray-600">
              Chúng tôi mang đến phong cách thời trang hiện đại và độc đáo cho người Việt
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Our Story" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
              <p className="text-gray-700 mb-4">
                Fashion Shop được thành lập vào năm 2025 với sứ mệnh mang đến những sản phẩm thời trang chất lượng cao với giá cả phải chăng cho người tiêu dùng Việt Nam.
              </p>
              <p className="text-gray-700 mb-4">
                Chúng tôi tin rằng thời trang không chỉ là về quần áo, mà còn là cách bạn thể hiện cá tính và phong cách sống của mình. Vì vậy, mỗi sản phẩm của Fashion Shop đều được thiết kế với sự tỉ mỉ và chăm chút đến từng chi tiết.
              </p>
              <p className="text-gray-700">
                Từ những ngày đầu tiên với một cửa hàng nhỏ, đến nay Fashion Shop đã phát triển thành một thương hiệu được yêu thích với nhiều chi nhánh trên toàn quốc và hệ thống bán hàng trực tuyến hiện đại.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Chất lượng</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, được làm từ những chất liệu tốt nhất và quy trình sản xuất nghiêm ngặt.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Phong cách</h3>
              <p className="text-gray-600">
                Mỗi thiết kế của chúng tôi đều mang đến phong cách độc đáo, hiện đại và phù hợp với xu hướng thời trang thế giới.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Khách hàng</h3>
              <p className="text-gray-600">
                Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi. Chúng tôi luôn lắng nghe và cải thiện dịch vụ để đáp ứng nhu cầu của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Đội ngũ của chúng tôi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                position: "Nhà sáng lập & CEO",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              },
              {
                name: "Trần Thị B",
                position: "Giám đốc thiết kế",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
              },
              {
                name: "Lê Văn C",
                position: "Giám đốc marketing",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              },
              {
                name: "Phạm Thị D",
                position: "Giám đốc vận hành",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Minh Anh",
                text: "Tôi rất hài lòng với chất lượng sản phẩm của Fashion Shop. Quần áo không chỉ đẹp mà còn rất bền, giữ form tốt sau nhiều lần giặt.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              },
              {
                name: "Hoàng Nam",
                text: "Dịch vụ khách hàng tuyệt vời! Tôi đã gặp vấn đề với đơn hàng của mình và đội ngũ hỗ trợ đã giải quyết rất nhanh chóng và hiệu quả.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              },
              {
                name: "Thu Hà",
                text: "Fashion Shop luôn cập nhật những xu hướng thời trang mới nhất. Tôi thường xuyên mua sắm ở đây và luôn tìm thấy những món đồ phù hợp với phong cách của mình.",
                image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <h3 className="font-bold">{testimonial.name}</h3>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;